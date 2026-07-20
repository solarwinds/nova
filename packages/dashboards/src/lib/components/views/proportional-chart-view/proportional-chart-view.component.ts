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
    EventEmitter,
    Input,
    KeyValueDiffer,
    KeyValueDiffers,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import some from "lodash/some";
import { Subscription } from "rxjs";

import { UnitConversionService } from "@nova-ui/bits";
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

import { DashboardUnitConversionPipe } from "../../../common/pipes/dashboard-unit-conversion-pipe";
import { CategoryChartUtilService } from "../../../services/category-chart-util.service";
import { ProportionalWidgetChartTypes } from "../../proportional-widget/types";
import {
    IProportionalDataItem,
    ProportionalChartType,
    ViewLegendPlacement,
} from "../types";

const CHART_TYPE_MAP: Record<ProportionalChartType, ProportionalWidgetChartTypes> = {
    donut: ProportionalWidgetChartTypes.DonutChart,
    pie: ProportionalWidgetChartTypes.PieChart,
    verticalBar: ProportionalWidgetChartTypes.VerticalBarChart,
    horizontalBar: ProportionalWidgetChartTypes.HorizontalBarChart,
};

@Component({
    selector: "nui-proportional-chart-view",
    templateUrl: "./proportional-chart-view.component.html",
    styleUrls: ["./proportional-chart-view.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    standalone: false,
})
export class ProportionalChartViewComponent implements AfterViewInit, OnChanges, OnDestroy {
    private static NO_SWITCH_LAYOUT_INTERVAL_SIZE = 20;
    private static MAX_ROW_LAYOUT_SIZE = 360;
    private static TICK_LABEL_MAX_WIDTH = 75;

    @Input() public data: Array<IProportionalDataItem> = [];
    @Input() public chartType: ProportionalChartType = "donut";
    @Input() public legendPlacement: ViewLegendPlacement = "right";
    @Input() public colors: Array<string> | Record<string, string> = [];
    @Input() public interactive = false;
    @Input() public donutContentTemplate: TemplateRef<any>;
    @Input() public legendItemTemplate: TemplateRef<any>;

    @Output() public itemClick = new EventEmitter<IProportionalDataItem>();

    public chartAssist: ChartAssist;
    public accessors: IAccessors;
    public donutContentPlugin: ChartDonutContentPlugin | null;
    public prioritizedGridRows = {
        right: false,
        bottom: false,
    };

    @ViewChild("gridContainer", { static: true })
    private gridContainer: ElementRef;

    private differ: KeyValueDiffer<any, any>;
    private renderer: Renderer<IAccessors>;
    private scales: Scales;
    private chartPalette: IChartPalette = new ChartPalette(defaultColorProvider());
    private resizeObserver: ResizeObserver;
    private chartTypeSubscription$: Subscription;
    private unitConversionPipe: DashboardUnitConversionPipe;
    private chartSeries: Array<IChartAssistSeries<IAccessors>> = [];

    constructor(
        private changeDetector: ChangeDetectorRef,
        private ngZone: NgZone,
        private kvDiffers: KeyValueDiffers,
        unitConversionService: UnitConversionService
    ) {
        this.differ = this.kvDiffers.find(this.prioritizedGridRows).create();
        this.unitConversionPipe = new DashboardUnitConversionPipe(unitConversionService);
    }

    public get isEmpty(): boolean {
        return !this.data || this.data.length === 0;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.data || changes.colors) {
            this.updateChartColors();
        }

        if (changes.chartType) {
            this.buildChart(CHART_TYPE_MAP[this.chartType]);
            if (this.data?.length) {
                this.updateChart();
            }
            this.changeDetector.markForCheck();
        } else if (changes.data && this.chartAssist) {
            this.updateChart();
            this.changeDetector.markForCheck();
        }

        if (changes.legendPlacement) {
            this.changeDetector.markForCheck();
        }
    }

    public ngAfterViewInit(): void {
        this.handleGridFlowOnResize();
    }

    public ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
        this.chartTypeSubscription$?.unsubscribe();
    }

    public isDonutChart(): boolean {
        return this.chartType === "donut";
    }

    public hasLegend(): boolean {
        return this.legendPlacement !== "none";
    }

    public legendShouldBeAlignedRight(): boolean {
        return this.legendPlacement === "right";
    }

    public onInteraction(legendSeries: any): void {
        if (!this.interactive) {
            return;
        }
        const item = this.data.find((d) => d.id === legendSeries?.id);
        if (item) {
            this.itemClick.emit(item);
        }
    }

    public computeLegendTileValue(legendSeries: unknown): string | undefined {
        // @ts-ignore: Suppressing series null parameter value error
        return this.accessors.data?.value?.(legendSeries, 0, null, null);
    }

    private buildChart(chartType: ProportionalWidgetChartTypes): void {
        this.donutContentPlugin = null;
        const { grid, accessors, renderer, scales, preprocessor } =
            CategoryChartUtilService.getChartAttributes(chartType, this.chartPalette?.standardColors);

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

        if (chartType === ProportionalWidgetChartTypes.HorizontalBarChart) {
            this.scales.x.formatters.tick = (value: string | number | undefined) =>
                this.unitConversionPipe.transform(value);
            this.applyTickLabelMaxWidths();
        } else if (chartType === ProportionalWidgetChartTypes.VerticalBarChart) {
            this.scales.y.formatters.tick = (value: string | number | undefined) =>
                this.unitConversionPipe.transform(value);
        }

        this.chartTypeSubscription$?.unsubscribe();
        this.chartTypeSubscription$ = this.chartAssist.chart
            .getEventBus()
            .getStream(SELECT_DATA_POINT_EVENT)
            .subscribe((event) => {
                const item = this.data.find((d) => d.id === event.data.seriesId);
                if (item) {
                    this.onInteraction({ id: item.id });
                }
            });
    }

    private handleGridFlowOnResize(): void {
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver.observe(this.gridContainer.nativeElement);
        });
    }

    private applyTickLabelMaxWidths(): void {
        const gridConfigAxis = (this.chartAssist.chart.getGrid().config() as XYGridConfig).axis;
        gridConfigAxis.left.tickLabel.maxWidth = ProportionalChartViewComponent.TICK_LABEL_MAX_WIDTH;
        gridConfigAxis.right.tickLabel.maxWidth = ProportionalChartViewComponent.TICK_LABEL_MAX_WIDTH;
    }

    private onResize(): void {
        if (this.isContainerInNoSwitchLayoutInterval()) {
            return;
        }

        switch (this.legendPlacement) {
            case "bottom":
                this.prioritizedGridRows.bottom = this.containerHasRowLayoutWidth();
                break;
            case "right":
                this.prioritizedGridRows.right = this.containerHasRowLayoutWidth();
                break;
        }

        if (this.differ.diff(this.prioritizedGridRows)) {
            this.changeDetector.detectChanges();
        }
    }

    private isContainerInNoSwitchLayoutInterval(): boolean {
        const containerWidth = this.gridContainer.nativeElement.getBoundingClientRect().width;
        return (
            containerWidth >
                ProportionalChartViewComponent.MAX_ROW_LAYOUT_SIZE -
                    ProportionalChartViewComponent.NO_SWITCH_LAYOUT_INTERVAL_SIZE / 2 &&
            containerWidth <
                ProportionalChartViewComponent.MAX_ROW_LAYOUT_SIZE +
                    ProportionalChartViewComponent.NO_SWITCH_LAYOUT_INTERVAL_SIZE / 2
        );
    }

    private containerHasRowLayoutWidth(): boolean {
        const containerWidth = this.gridContainer.nativeElement.getBoundingClientRect().width;
        return containerWidth < ProportionalChartViewComponent.MAX_ROW_LAYOUT_SIZE;
    }

    private updateChart(): void {
        this.chartSeries = this.mapDataToSeries();
        this.chartAssist.update(
            CategoryChartUtilService.buildChartSeries(
                this.chartSeries,
                this.accessors,
                this.renderer,
                this.scales
            )
        );
    }

    private updateChartColors(): void {
        let colorProvider: IValueProvider<string>;

        const dataColors = this.data?.map((v) => v.color);
        const configColors = this.colors;

        if (some(dataColors)) {
            colorProvider = this.getDataDrivenColorProvider();
        } else if (configColors && (Array.isArray(configColors) ? configColors.length > 0 : Object.keys(configColors).length > 0)) {
            colorProvider = this.getConfigurationColorProvider(configColors);
        } else {
            colorProvider = defaultColorProvider();
        }

        this.chartPalette = new ChartPalette(colorProvider);
        this.buildChart(CHART_TYPE_MAP[this.chartType]);
        if (this.chartAssist) {
            this.chartAssist.palette = this.chartPalette;
            this.updateChart();
        }
    }

    private getDataDrivenColorProvider(): IValueProvider<string> {
        const dataColors = this.data?.map((v) => v.color).filter((v): v is string => !!v);

        if (dataColors.length === this.data.length) {
            const colorMap = this.data.reduce((acc: Record<string, string>, next) => {
                acc[next.id] = next.color!;
                return acc;
            }, {});
            return new MappedValueProvider<string>(colorMap);
        }

        return new SequentialColorProvider(dataColors);
    }

    private getConfigurationColorProvider(colors: Array<string> | Record<string, string>): IValueProvider<string> {
        if (Array.isArray(colors)) {
            return new SequentialColorProvider(colors);
        }
        return new MappedValueProvider<string>(colors);
    }

    private mapDataToSeries(): Array<IChartAssistSeries<IAccessors>> {
        return this.data.map((item) => ({
            id: item.id,
            name: item.name,
            data: [{ value: item.value }],
            color: item.color,
            link: item.link,
            accessors: this.accessors,
            renderer: this.renderer,
            scales: this.scales,
        }));
    }
}
