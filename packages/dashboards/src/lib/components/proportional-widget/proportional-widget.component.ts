// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
import isEqual from "lodash/isEqual";
import some from "lodash/some";
import { Subscription } from "rxjs";

import {
    EventBus,
    IDataSource,
    IEvent,
    LoggerService,
    UnitConversionService,
} from "@nova-ui/bits";
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
    XYGridConfig,
} from "@nova-ui/charts";

import { DashboardUnitConversionPipe } from "../../common/pipes/dashboard-unit-conversion-pipe";
import { CategoryChartUtilService } from "../../services/category-chart-util.service";
import { INTERACTION } from "../../services/types";
import {
    DATA_SOURCE,
    IHasChangeDetector,
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../types";
import { LegendPlacement } from "../../widget-types/common/widget/legend";
import { IFormatter } from "../types";
import {
    IProportionalWidgetData,
    IProportionalWidgetConfig,
    ProportionalWidgetChartTypes,
} from "./types";

/** @ignore */
@Component({
    selector: "nui-proportional-widget",
    templateUrl: "./proportional-widget.component.html",
    styleUrls: ["./proportional-widget.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    standalone: false,
})
export class ProportionalWidgetComponent
    implements AfterViewInit, OnChanges, IHasChangeDetector, OnDestroy
{
    static lateLoadKey = "ProportionalWidgetComponent";
    private static NO_SWITCH_LAYOUT_INTERVAL_SIZE = 20;
    private static MAX_ROW_LAYOUT_SIZE = 360;
    private static TICK_LABEL_MAX_WIDTH = 75;

    @Input() public widgetData: IProportionalWidgetData[];
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
    private chartPalette: IChartPalette = new ChartPalette(
        defaultColorProvider()
    );
    private proportionalWidgetResizeObserver: ResizeObserver;
    private unitConversionPipe: DashboardUnitConversionPipe;

    @ViewChild("gridContainer", { static: true })
    private gridContainer: ElementRef;

    private chartTypeSubscription$: Subscription;

    public get interactive(): boolean {
        return (
            this.configuration?.interactive ||
            this.dataSource?.features?.getFeatureConfig(
                WellKnownDataSourceFeatures.Interactivity
            )?.enabled ||
            false
        );
    }

    constructor(
        public changeDetector: ChangeDetectorRef,
        private ngZone: NgZone,
        private kvDiffers: KeyValueDiffers,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        @Inject(DATA_SOURCE) private dataSource: IDataSource,
        private logger: LoggerService,
        unitConversionService: UnitConversionService
    ) {
        this.differ = this.kvDiffers.find(this.prioritizedGridRows).create();
        this.unitConversionPipe = new DashboardUnitConversionPipe(
            unitConversionService
        );
    }

    // Note: Using this helper method to be able to use
    // optional method chaining and prevent strict mode error
    public computeLegendTileValue(legendSeries: unknown): string | undefined {
        // @ts-ignore: Suppressing series null parameter value error to avoid breaking default flow
        return this.accessors.data?.value?.(legendSeries, 0, null, null);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const newChartColors = changes.configuration?.currentValue?.chartColors;
        const prevChartColors =
            changes.configuration?.previousValue?.chartColors;

        if (changes.widgetData || !isEqual(newChartColors, prevChartColors)) {
            this.updateChartColors();
        }

        if (changes.configuration) {
            const newChartType =
                changes.configuration.currentValue.chartOptions.type;
            const prevChartType =
                changes.configuration.previousValue &&
                changes.configuration.previousValue.chartOptions.type;

            // configure the chart
            if (newChartType && newChartType !== prevChartType) {
                this.buildChart(newChartType);

                if (this.widgetData) {
                    this.updateChart();
                }
            }

            this.legendFormatter =
                this.configuration.chartOptions.legendFormatter;
            this.contentFormatter =
                this.configuration.chartOptions.contentFormatter;
            this.chartFormatterComponentType =
                this.configuration.chartOptions.chartFormatterComponentType;

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

    public ngAfterViewInit(): void {
        this.handleGridFlowOnResize();
    }

    public ngOnDestroy(): void {
        this.proportionalWidgetResizeObserver?.disconnect();
        this.chartTypeSubscription$?.unsubscribe();
    }

    public getContentFormatterProperties(): void {
        this.contentFormatterProperties = {
            data: this.widgetData,
            config: this.configuration,
            chartAssist: this.chartAssist,
            properties: this.contentFormatter?.properties,
        };
    }

    /** Checks if chart is donut. */
    public isDonutChart(): boolean {
        return (
            this.configuration.chartOptions.type ===
            ProportionalWidgetChartTypes.DonutChart
        );
    }

    /** Checks if chart is radial. */
    public isRadialChart(): boolean {
        return (
            [
                ProportionalWidgetChartTypes.DonutChart,
                ProportionalWidgetChartTypes.PieChart,
            ].indexOf(this.configuration.chartOptions.type) !== -1
        );
    }

    /** Checks if legend should be shown. */
    public hasLegend(): boolean {
        return (
            this.configuration.chartOptions.legendPlacement !==
            LegendPlacement.None
        );
    }

    /** Checks if legend should be aligned to right. */
    public legendShouldBeAlignedRight(): boolean {
        return (
            this.configuration.chartOptions.legendPlacement ===
            LegendPlacement.Right
        );
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
        const { grid, accessors, renderer, scales, preprocessor } =
            CategoryChartUtilService.getChartAttributes(
                chartType,
                this.chartPalette?.standardColors
            );
        // TODO: Refactor this to be able to pass different types of preprocessor to get rid of the any
        this.chartAssist = new ChartAssist(
            new Chart(grid),
            <any>preprocessor,
            this.chartPalette
        );
        this.renderer = renderer;
        this.accessors = accessors;
        this.scales = scales;
        if (this.isDonutChart()) {
            this.donutContentPlugin = new ChartDonutContentPlugin();
            this.chartAssist.chart.addPlugin(this.donutContentPlugin);
        }

        if (
            this.configuration.chartOptions.type ===
            ProportionalWidgetChartTypes.HorizontalBarChart
        ) {
            this.scales.x.formatters.tick = (
                value: string | number | undefined
            ) => this.unitConversionPipe.transform(value);
            this.applyTickLabelMaxWidths();
        } else if (
            this.configuration.chartOptions.type ===
            ProportionalWidgetChartTypes.VerticalBarChart
        ) {
            this.scales.y.formatters.tick = (
                value: string | number | undefined
            ) => this.unitConversionPipe.transform(value);
        }

        this.chartTypeSubscription$?.unsubscribe();
        this.chartTypeSubscription$ = this.chartAssist.chart
            .getEventBus()
            .getStream(SELECT_DATA_POINT_EVENT)
            .subscribe((event) => {
                // event payload is a data point from the chart - since we display one data point for every series,
                // we convert the data point to the original series
                const series = this.widgetData.find(
                    (s) => s.id === event.data.seriesId
                );
                this.onInteraction(series);
            });
    }

    private handleGridFlowOnResize(): void {
        this.proportionalWidgetResizeObserver = new ResizeObserver(() =>
            this.onResize()
        );
        this.ngZone.runOutsideAngular(() => {
            this.proportionalWidgetResizeObserver.observe(
                this.gridContainer.nativeElement
            );
        });
    }

    private applyTickLabelMaxWidths() {
        const gridConfigAxis = (
            this.chartAssist.chart.getGrid().config() as XYGridConfig
        ).axis;

        gridConfigAxis.left.tickLabel.maxWidth =
            this.configuration.chartOptions.horizontalBarTickLabelConfig
                ?.maxWidth?.left ??
            ProportionalWidgetComponent.TICK_LABEL_MAX_WIDTH;
        gridConfigAxis.right.tickLabel.maxWidth =
            this.configuration.chartOptions.horizontalBarTickLabelConfig
                ?.maxWidth?.right ??
            ProportionalWidgetComponent.TICK_LABEL_MAX_WIDTH;
    }

    private onResize(): void {
        if (this.isContainerInNoSwitchLayoutInterval()) {
            return;
        }

        switch (this.configuration.chartOptions.legendPlacement) {
            case LegendPlacement.Bottom:
                this.prioritizedGridRows.bottom =
                    this.containerHasRowLayoutWidth();
                break;
            case LegendPlacement.Right:
                this.prioritizedGridRows.right =
                    this.containerHasRowLayoutWidth();
                break;
        }

        if (this.differ.diff(this.prioritizedGridRows)) {
            this.changeDetector.detectChanges();
        }
    }

    private isContainerInNoSwitchLayoutInterval(): boolean {
        const containerWidth =
            this.gridContainer.nativeElement.getBoundingClientRect().width;
        return (
            containerWidth >
                ProportionalWidgetComponent.MAX_ROW_LAYOUT_SIZE -
                    ProportionalWidgetComponent.NO_SWITCH_LAYOUT_INTERVAL_SIZE /
                        2 &&
            containerWidth <
                ProportionalWidgetComponent.MAX_ROW_LAYOUT_SIZE +
                    ProportionalWidgetComponent.NO_SWITCH_LAYOUT_INTERVAL_SIZE /
                        2
        );
    }

    private containerHasRowLayoutWidth(): boolean {
        const containerWidth =
            this.gridContainer.nativeElement.getBoundingClientRect().width;
        return containerWidth < ProportionalWidgetComponent.MAX_ROW_LAYOUT_SIZE;
    }

    /** Builds the chart */
    private updateChart(): void {
        this.chartAssist.update(
            CategoryChartUtilService.buildChartSeries(
                this.widgetData,
                this.accessors,
                this.renderer,
                this.scales
            )
        );
    }

    private updateChartColors(): void {
        let colorProvider: IValueProvider<string>;

        const dataColors = this.widgetData?.map((v) => v.color);
        const configurationColors = this.configuration.chartColors;

        if (!this.configuration.prioritizeWidgetColors && some(dataColors)) {
            colorProvider = this.getDataDriverColorProvider(this.widgetData);
        } else if (configurationColors) {
            colorProvider =
                this.getConfigurationColorProvider(configurationColors);
        } else {
            colorProvider = defaultColorProvider();
        }

        this.chartPalette = new ChartPalette(colorProvider);
        this.buildChart(this.configuration?.chartOptions.type);
        if (this.chartAssist) {
            this.chartAssist.palette = this.chartPalette;
            this.updateChart();
        }
    }

    private getDataDriverColorProvider(
        widgetData: IChartAssistSeries<IAccessors<any>>[]
    ): IValueProvider<string> {
        let colorProvider: IValueProvider<string>;

        const dataColors = widgetData?.map((v) => v.color).filter((v) => !!v);

        if (dataColors.length === widgetData.length) {
            const colorMap = widgetData.reduce(
                (acc: { [key: string]: string }, next) => {
                    acc[next.id] = next.color;
                    return acc;
                },
                {}
            );
            colorProvider = new MappedValueProvider<string>(colorMap);
        } else {
            const widgetDataWithColor = widgetData.filter(
                (series) => series.color
            );

            this.logger.warn(
                `Not all series have colors set, setting default pallette. Current series color config: ${JSON.stringify(
                    widgetDataWithColor
                )}`
            );
            colorProvider = defaultColorProvider();
        }

        return colorProvider;
    }

    private getConfigurationColorProvider(
        configurationColors:
            | string[]
            | {
                  [key: string]: string;
              }
    ): IValueProvider<string> {
        let colorProvider: IValueProvider<string>;

        // remove data colors since nui-chart takes them into consideration no matter what
        if (this.configuration.prioritizeWidgetColors && this.widgetData) {
            this.widgetData = this.widgetData.map((origin) => {
                const series = { ...origin };
                if (series.color) {
                    delete series.color;
                }
                return series;
            });
        }

        if (Array.isArray(configurationColors)) {
            colorProvider = new SequentialColorProvider(configurationColors);
        } else {
            const setupColorsLength = Object.keys(configurationColors).length;
            if (setupColorsLength === this.widgetData?.length) {
                colorProvider = new MappedValueProvider(configurationColors);
            } else {
                // eslint-disable-next-line max-len
                this.logger.warn(
                    `Not all series have colors set, setting default pallette. Current series color config: ${JSON.stringify(
                        configurationColors
                    )}`
                );
                colorProvider = defaultColorProvider();
            }
        }

        return colorProvider;
    }

    public get isEmpty(): boolean {
        return (
            !this.widgetData ||
            this.widgetData.length === 0 ||
            !this.chartAssist
        );
    }
}
