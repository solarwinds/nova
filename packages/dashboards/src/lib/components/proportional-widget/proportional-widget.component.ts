import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    KeyValueDiffer,
    KeyValueDiffers,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    ChartPalette,
    defaultColorProvider,
    IAccessors,
    IChartAssistSeries,
    IChartPalette,
    IValueProvider,
    MappedValueProvider,
    Renderer,
    Scales,
    SELECT_DATA_POINT_EVENT,
    SequentialColorProvider,
} from "@nova-ui/charts";
import isEqual from "lodash/isEqual";
import some from "lodash/some";
import ResizeObserver from "resize-observer-polyfill";
import { Subscription } from "rxjs";

import { CategoryChartUtilService } from "../../services/category-chart-util.service";
import { INTERACTION } from "../../services/types";
import { DATA_SOURCE, IHasChangeDetector, PIZZAGNA_EVENT_BUS, WellKnownDataSourceFeatures } from "../../types";
import { IFormatter, LegendPlacement } from "../types";

import { IProportionalWidgetConfig, ProportionalWidgetChartTypes } from "./types";

/** @ignore */
@Component({
    selector: "nui-proportional-widget",
    templateUrl: "./proportional-widget.component.html",
    styleUrls: ["./proportional-widget.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    // TODO: uncomment when NUI-4307 is fixed
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProportionalWidgetComponent implements AfterViewInit, OnChanges, IHasChangeDetector, OnDestroy {
    static lateLoadKey = "ProportionalWidgetComponent";
    private static NO_SWITCH_LAYOUT_INTERVAL_SIZE = 20;
    private static MAX_ROW_LAYOUT_SIZE = 360;

    @Input() public widgetData: IChartAssistSeries<IAccessors>[];
    @Input() public configuration: IProportionalWidgetConfig;
    @Input() @HostBinding("class") public elementClass: string;
    @Input() public seriesToIconMap: { [seriesId: string]: string }; // will be defined using dataSource

    public chartAssist: ChartAssist;
    public accessors: IAccessors;
    public donutContentPlugin: ChartDonutContentPlugin | null;
    public legendUnitLabel: string;
    public legendFormatter: IFormatter | undefined;
    public contentFormatter: IFormatter | undefined;
    public chartFormatterComponentType: string | undefined;
    public contentFormatterProperties: any;
    public prioritizedGridRows = {
        right: false,
        bottom: false,
    };

    private differ: KeyValueDiffer<any, any>;

    private renderer: Renderer<IAccessors>;
    private scales: Scales;
    private chartPalette: IChartPalette = new ChartPalette(defaultColorProvider());
    private proportionalWidgetResizeObserver: ResizeObserver;

    @ViewChild("gridContainer", { static: true })
    private gridContainer: ElementRef;

    private chartTypeSubscription$: Subscription;

    public get interactive() {
        return this.configuration?.interactive ||
            this.dataSource?.features?.getFeatureConfig(WellKnownDataSourceFeatures.Interactivity)?.enabled;
    }

    constructor(public changeDetector: ChangeDetectorRef,
                private ngZone: NgZone,
                private kvDiffers: KeyValueDiffers,
                @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
                @Inject(DATA_SOURCE) private dataSource: IDataSource) {
        this.differ = this.kvDiffers.find(this.prioritizedGridRows).create();
    }

    // Note: Using this helper method to be able to use
    // optional method chaining and prevent strict mode error
    public computeLegendTitle(legendSeries: unknown): string | undefined {
        // @ts-ignore: Suppressing series null parameter value error to avoid breaking default flow
        return this.accessors.data?.value?.(legendSeries, 0, null, null);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const newChartColors = changes.configuration?.currentValue?.chartColors;
        const prevChartColors = changes.configuration?.previousValue?.chartColors;

        if (changes.widgetData || !isEqual(newChartColors, prevChartColors)) {
            this.updateChartColors();
        }

        if (changes.configuration) {
            const newChartType = changes.configuration.currentValue.chartOptions.type;
            const prevChartType = changes.configuration.previousValue && changes.configuration.previousValue.chartOptions.type;

            // configure the chart
            if ((newChartType && newChartType !== prevChartType)) {
                this.buildChart(newChartType);

                if (this.widgetData) {
                    this.updateChart();
                }
            }

            this.legendFormatter = this.configuration.chartOptions.legendFormatter;
            this.contentFormatter = this.configuration.chartOptions.contentFormatter;
            this.chartFormatterComponentType = this.configuration.chartOptions.chartFormatterComponentType;

            this.getContentFormatterProperties();

            this.changeDetector.markForCheck();
        }

        if (changes.widgetData) {
            if (this.chartAssist) {
                this.updateChart();
                this.getContentFormatterProperties();
                this.changeDetector.markForCheck();
            }
        }
    }

    public ngAfterViewInit() {
        this.handleGridFlowOnResize();
    }

    public ngOnDestroy() {
        this.proportionalWidgetResizeObserver?.disconnect();
        this.chartTypeSubscription$?.unsubscribe();
    }

    public getContentFormatterProperties() {
        this.contentFormatterProperties = {
            data: this.widgetData,
            config: this.configuration,
            chartAssist: this.chartAssist,
            properties: this.contentFormatter?.properties,
        };
    }

    /** Checks if chart is donut. */
    public isDonutChart(): boolean {
        return this.configuration.chartOptions.type === ProportionalWidgetChartTypes.DonutChart;
    }

    /** Checks if chart is radial. */
    public isRadialChart(): boolean {
        return [ProportionalWidgetChartTypes.DonutChart, ProportionalWidgetChartTypes.PieChart].indexOf(this.configuration.chartOptions.type) !== -1;
    }

    /** Checks if legend should be shown. */
    public hasLegend(): boolean {
        return this.configuration.chartOptions.legendPlacement !== LegendPlacement.None;
    }

    /** Checks if legend should be aligned to right. */
    public legendShouldBeAlignedRight(): boolean {
        return this.configuration.chartOptions.legendPlacement === LegendPlacement.Right;
    }

    public onInteraction(data: any): void {
        if (!this.interactive) {
            return;
        }

        this.eventBus.getStream(INTERACTION).next({ payload: { data } });
    }

    /** Configures the chart options */
    private buildChart(chartType: ProportionalWidgetChartTypes): void {
        this.donutContentPlugin = null;
        const { grid, accessors, renderer, scales, preprocessor } = CategoryChartUtilService.getChartAttributes(chartType, this.chartPalette?.standardColors);
        // TODO: Refactor this to be able to pass different types of preprocessor to get rid of the any
        this.chartAssist = new ChartAssist(new Chart(grid), <any>preprocessor, this.chartPalette);
        this.renderer = renderer;
        this.accessors = accessors;
        this.scales = scales;
        if (this.isDonutChart()) {
            this.donutContentPlugin = new ChartDonutContentPlugin();
            this.chartAssist.chart.addPlugin(this.donutContentPlugin);
        }

        this.chartTypeSubscription$?.unsubscribe();
        this.chartTypeSubscription$ = this.chartAssist.chart.getEventBus().getStream(SELECT_DATA_POINT_EVENT).subscribe((event) => {
            // event payload is a data point from the chart - since we display one data point for every series,
            // we convert the data point to the original series
            const series = this.widgetData.find(s => s.id === event.data.seriesId);
            this.onInteraction(series);
        });
    }

    private handleGridFlowOnResize(): void {
        this.proportionalWidgetResizeObserver = new ResizeObserver(() => this.onResize());
        this.ngZone.runOutsideAngular(() => {
            this.proportionalWidgetResizeObserver.observe(this.gridContainer.nativeElement);
        });
    }

    private onResize(): void {
        if (this.isContainerInNoSwitchLayoutInterval()) {
            return;
        }

        switch (this.configuration.chartOptions.legendPlacement) {
            case LegendPlacement.Bottom:
                this.prioritizedGridRows.bottom = this.containerHasRowLayoutWidth();
                break;
            case LegendPlacement.Right:
                this.prioritizedGridRows.right = this.containerHasRowLayoutWidth();
                break;
        }

        if (this.differ.diff(this.prioritizedGridRows)) {
            this.changeDetector.detectChanges();
        }
    }

    private isContainerInNoSwitchLayoutInterval(): boolean {
        const containerWidth = this.gridContainer.nativeElement.getBoundingClientRect().width;
        return containerWidth > ProportionalWidgetComponent.MAX_ROW_LAYOUT_SIZE - (ProportionalWidgetComponent.NO_SWITCH_LAYOUT_INTERVAL_SIZE / 2)
            && containerWidth < ProportionalWidgetComponent.MAX_ROW_LAYOUT_SIZE + (ProportionalWidgetComponent.NO_SWITCH_LAYOUT_INTERVAL_SIZE / 2);
    }

    private containerHasRowLayoutWidth(): boolean {
        const containerWidth = this.gridContainer.nativeElement.getBoundingClientRect().width;
        return containerWidth < ProportionalWidgetComponent.MAX_ROW_LAYOUT_SIZE;
    }

    /** Builds the chart */
    private updateChart(): void {
        this.chartAssist.update(CategoryChartUtilService.buildChartSeries(this.widgetData, this.accessors, this.renderer, this.scales));
    }

    private updateChartColors(): void {
        let colorProvider: IValueProvider<string>;

        const dataColors = this.widgetData?.map(v => v.color);
        const configurationColors = this.configuration.chartColors;

        if (!this.configuration.prioritizeWidgetColors && some(dataColors)) {
            const colorMap = this.widgetData.reduce((acc: { [key: string]: string }, next) => {
                acc[next.id] = next.color;
                return acc;
            }, {});
            colorProvider = new MappedValueProvider<string>(colorMap);
        } else if (configurationColors) {
            colorProvider = Array.isArray(configurationColors)
                ? new SequentialColorProvider(configurationColors)
                : new MappedValueProvider(configurationColors);
        } else {
            colorProvider = defaultColorProvider();
        }

        this.chartPalette = new ChartPalette(colorProvider);
        if (this.chartAssist) {
            this.chartAssist.palette = this.chartPalette;
            this.buildChart(this.configuration?.chartOptions.type);
            this.updateChart();
        }
    }
}
