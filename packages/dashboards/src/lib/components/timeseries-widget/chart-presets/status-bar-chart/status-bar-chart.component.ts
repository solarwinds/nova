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
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    Optional,
} from "@angular/core";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    EventBus,
    IconService,
    IDataSource,
    IEvent,
    uuid,
} from "@nova-ui/bits";
import {
    BandScale,
    BarHighlightStrategy,
    BarRenderer,
    Chart,
    DESTROY_EVENT,
    IAccessors,
    IChartAssistSeries,
    IChartEvent,
    ISetDomainEventPayload,
    IStatusAccessors,
    Renderer,
    SET_DOMAIN_EVENT,
    SparkChartAssist,
    StatusAccessors,
    statusAccessors,
    TimeIntervalScale,
    TimeseriesZoomPlugin,
    XYGridConfig,
    ZoomPlugin,
} from "@nova-ui/charts";

import { CHART_METRIC_REMOVE, SET_TIMEFRAME } from "../../../../services/types";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { TimeseriesScalesService } from "../../timeseries-scales.service";
import {
    ITimeseriesWidgetData,
    ITimeseriesWidgetStatusData,
    TimeseriesChartPreset,
    TimeseriesChartTypes,
    TimeseriesWidgetProjectType,
    TimeseriesWidgetZoomPlugin,
} from "../../types";
import { TimeseriesChartComponent } from "../timeseries-chart.component";
import {
    SUMMARY_LEGEND_BCG_COLOR,
    SUMMARY_LEGEND_COLOR,
} from "../../timeseries-helpers";

@Component({
    selector: "nui-status-bar-chart",
    templateUrl: "./status-bar-chart.component.html",
    styleUrls: ["./status-bar-chart.component.less"],
})
export class StatusBarChartComponent
    extends TimeseriesChartComponent<ITimeseriesWidgetStatusData>
    implements OnInit
{
    public static lateLoadKey = "StatusChartComponent";

    public chartAssist: SparkChartAssist;
    public collectionId: string = uuid("timeseries-status-charts");
    protected accessors: StatusAccessors;
    protected renderer: Renderer<IAccessors>;
    private chartUpdate$ = new Subject<void>();

    public zoomPlugins: TimeseriesWidgetZoomPlugin[];
    public timeseriesChartTypes = TimeseriesChartTypes;
    public summaryLegendBcgColor = SUMMARY_LEGEND_BCG_COLOR;
    public summaryLegendColor = SUMMARY_LEGEND_COLOR;

    constructor(
        private iconService: IconService,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        public timeseriesScalesService: TimeseriesScalesService,
        public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>
    ) {
        super(timeseriesScalesService, dataSource);
    }

    public ngOnInit() {}

    public getDataPointData(
        series: IChartAssistSeries<IAccessors>,
        key: string
    ): any {
        const data = this.chartAssist.highlightedDataPoints[series.id]?.data;
        if (data) {
            return data[key];
        }
        return series.data.length > 0
            ? series.data[series.data.length - 1][key]
            : undefined;
    }

    protected buildChart(): void {
        this.buildChart$.next();
        this.chartAssist = new SparkChartAssist();

        this.accessors = statusAccessors(
            this.chartAssist.palette.standardColors
        );
        this.accessors.data.color = (d, i, series, dataSeries) =>
            typeof d.color === "undefined"
                ? "var(--nui-color-semantic-unknown)"
                : d.color;

        this.accessors.data.thickness = (data: any) =>
            typeof data.thick === "undefined" || data.thick
                ? BarRenderer.THICK
                : BarRenderer.THIN;

        const iconSize: number = 8;
        this.accessors.data.marker = (data: any) =>
            data.icon
                ? this.iconService.getIconResized(
                      this.iconService.getIconData(data.icon).code,
                      iconSize
                  )
                : undefined;

        this.accessors.data.y = (d) => d.value;

        // disable pointer events on bars to ensure the zoom drag target is the mouse interactive area rather than the bars
        this.renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
            pointerEvents: false,
        });

        this.setGridConfigFromConfiguration(this.chartAssist.gridConfig);
        this.setGridConfigFromConfiguration(this.chartAssist.lastGridConfig);

        this.scales.y = new BandScale();
        this.scales.y.fixDomain(StatusAccessors.STATUS_DOMAIN);
        this.scales.y.isTimeseriesScale = true;

        if (this.scales.yRight) {
            this.scales.yRight = this.scales.y;
        }
    }

    protected updateChartData(): void {
        const { gridConfig, lastGridConfig } = this.chartAssist;
        // hides botom axis if it's not last chart in the group
        gridConfig.axis.bottom.visible = !this.configuration?.hasAdjacentChart;
        lastGridConfig.axis.bottom.visible =
            !this.configuration?.hasAdjacentChart;
        gridConfig.borders.bottom.className = this.configuration
            ?.hasAdjacentChart
            ? "nui-chart-border"
            : "nui-chart-border nui-chart-border--thick";
        lastGridConfig.borders.bottom.className = this.configuration
            ?.hasAdjacentChart
            ? "nui-chart-border"
            : "nui-chart-border nui-chart-border--thick";

        this.chartUpdate$.next();

        // Assemble the series set
        let series = this.widgetData.series;
        const summarySerie = this.widgetData.summarySerie
            ? [this.widgetData.summarySerie]
            : [];
        if (
            series.length === 1 &&
            series[0].id === this.widgetData.summarySerie?.id
        ) {
            // if the series contains only one item and its the same as the summary serie,
            // there is no submetric and only the summary serie should be displayed
            series = [];
        }
        const seriesSet: IChartAssistSeries<IStatusAccessors>[] = [
            ...summarySerie,
            ...series,
        ].map((d: ITimeseriesWidgetData<ITimeseriesWidgetStatusData>) => ({
            ...d,
            data: this.transformData(
                d.data,
                this.scales.x instanceof TimeIntervalScale
            ),
            accessors: this.accessors,
            renderer: this.renderer,
            scales: this.scales,
        }));

        // Update the chart
        this.chartAssist.update(seriesSet);

        if (this.configuration.enableZoom) {
            this.chartAssist.sparks.forEach((spark, i) => {
                if (
                    this.configuration?.projectType ===
                    TimeseriesWidgetProjectType.PerfstackApp
                ) {
                    if (
                        !(spark?.chart as Chart)?.hasPlugin(
                            TimeseriesZoomPlugin
                        )
                    ) {
                        spark?.chart?.addPlugin(this.zoomPlugins[i]);
                    }
                } else {
                    if (!(spark?.chart as Chart)?.hasPlugin(ZoomPlugin)) {
                        spark?.chart?.addPlugin(
                            new ZoomPlugin({ enableExternalEvents: true })
                        );
                    }
                }
            });

            // only need to subscribe to one chart's SET_DOMAIN_EVENT
            this.chartAssist.sparks[0].chart
                ?.getEventBus()
                .getStream(SET_DOMAIN_EVENT)
                .pipe(
                    takeUntil(
                        merge(
                            this.chartUpdate$,
                            (
                                this.chartAssist.sparks[0].chart as Chart
                            )?.eventBus.getStream(DESTROY_EVENT),
                            this.buildChart$
                        )
                    )
                )
                .subscribe((event: IChartEvent) => {
                    const payload = <ISetDomainEventPayload>event.data;
                    const newDomain = payload[Object.keys(payload)[0]];
                    this.eventBus.getStream(SET_TIMEFRAME).next({
                        payload: {
                            startDatetime: newDomain[0],
                            endDatetime: newDomain[1],
                            selectedPresetId: null,
                        },
                    });
                });
        }
    }

    /**
     * Transforms standard timeseries x/y data so that it can be understood by a status chart
     *
     * @param data The data to transform
     * @param isIntervalProgression Whether the data should be treated as continuous or occurring at a regular interval
     *
     * @returns The transformed data
     */
    protected transformData(
        data: ITimeseriesWidgetStatusData[],
        isIntervalProgression: boolean
    ): IStatusData[] {
        const statusDataArray: any[] = [];
        data.forEach((d, i) => {
            if (isIntervalProgression || data.length - 1 !== i) {
                statusDataArray.push({
                    start: d.x,
                    end: isIntervalProgression ? d.x : data[i + 1].x,
                    status: d.y,
                    color: d.color,
                    thick: d.thick,
                    icon: d.icon,
                    value: d.y,
                });
            }
        });
        return statusDataArray;
    }

    private setGridConfigFromConfiguration(gridConfig: XYGridConfig): void {
        const configuration = this.configuration;

        if (configuration.gridConfig?.xAxisTicksCount) {
            gridConfig.axis.bottom.approximateTicks =
                configuration.gridConfig.xAxisTicksCount;
        }

        if (
            gridConfig.dimension.marginLocked &&
            configuration.gridConfig?.sideMarginLocked
        ) {
            gridConfig.dimension.marginLocked.left = true;
            gridConfig.dimension.marginLocked.right = true;
        }

        if (configuration.gridConfig?.sideMargin) {
            gridConfig.dimension.margin.left =
                configuration.gridConfig.sideMargin;
            gridConfig.dimension.margin.right =
                configuration.gridConfig.sideMargin;
        }
    }

    public displayDeleteButton(): boolean {
        return (
            !!this.configuration.allowLegendMenu &&
            this.configuration.projectType ===
                TimeseriesWidgetProjectType.PerfstackApp
        );
    }

    public removeMetric(metricId: string): void {
        this.eventBus.next(CHART_METRIC_REMOVE, {
            payload: {
                metricId: metricId,
                groupUniqueId: this.configuration.groupUniqueId,
            },
        });
    }

    public isStatusChart(): boolean {
        return this.configuration?.type !== TimeseriesChartTypes.alert;
    }

    public getDescriptionSecondary(
        series: IChartAssistSeries<IAccessors>,
        index: number
    ): string {
        if (this.isStatusChart()) {
            return series.legendDescriptionSecondary;
        }

        return index === 0 ? series.legendDescriptionSecondary : "";
    }
}

interface IStatusData {
    start: Date;
    end: Date;
    thick?: boolean;
    color?: string;
    icon?: string;
}
