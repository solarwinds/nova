import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from "@angular/core";
import { EventBus, IconService, IDataSource, IEvent, uuid } from "@solarwinds/nova-bits";
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
    ZoomPlugin
} from "@solarwinds/nova-charts";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { SET_TIMEFRAME } from "../../../../services/types";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { TimeseriesScalesService } from "../../timeseries-scales.service";
import { ITimeseriesWidgetData, ITimeseriesWidgetStatusData } from "../../types";
import { TimeseriesChartComponent } from "../timeseries-chart.component";

@Component({
    selector: "nui-status-bar-chart",
    templateUrl: "./status-bar-chart.component.html",
    styleUrls: ["./status-bar-chart.component.less"],
})
export class StatusBarChartComponent extends TimeseriesChartComponent<ITimeseriesWidgetStatusData> implements OnInit {
    public static lateLoadKey = "StatusChartComponent";

    public chartAssist: SparkChartAssist;
    public collectionId: string = uuid("timeseries-status-charts");
    protected accessors: StatusAccessors;
    protected renderer: Renderer<IAccessors>;
    private chartUpdate$ = new Subject<void>();

    constructor(private iconService: IconService,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        public timeseriesScalesService: TimeseriesScalesService,
        public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>) {
        super(timeseriesScalesService, dataSource);
    }

    public ngOnInit() {
    }

    public getDataPointData(series: IChartAssistSeries<IAccessors>, key: string): any {
        const data = this.chartAssist.highlightedDataPoints[series.id]?.data;
        if (data) {
            return data[key];
        }
        return series.data.length > 0 ? series.data[series.data.length - 1][key] : undefined;
    }

    protected buildChart(): void {
        this.buildChart$.next();
        this.chartAssist = new SparkChartAssist();

        this.accessors = statusAccessors(this.chartAssist.palette.standardColors);
        this.accessors.data.color = (d, i, series, dataSeries) =>
            typeof d.color === "undefined" ? "var(--nui-color-semantic-unknown)" : d.color;

        this.accessors.data.thickness = (data: any) => typeof data.thick === "undefined" || data.thick ?
            BarRenderer.THICK : BarRenderer.THIN;

        // with interval scale, every bar has to be shortened by one "interval" to prevent data from overlapping
        if (this.scales.x instanceof TimeIntervalScale) {
            const xScale = this.scales.x;
            this.accessors.data.end = (d) =>
                new Date(d.end - xScale.interval().asMilliseconds());
        }

        const iconSize: number = 8;
        this.accessors.data.marker = (data: any) =>
            data.icon ?
                this.iconService.getIconResized(this.iconService.getIconData(data.icon).code, iconSize) :
                undefined;

        // disable pointer events on bars to ensure the zoom drag target is the mouse interactive area rather than the bars
        this.renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x"), pointerEvents: false });

        this.scales.y = new BandScale();
        this.scales.y.fixDomain(StatusAccessors.STATUS_DOMAIN);
    }

    protected updateChartData(): void {
        this.chartUpdate$.next();

        // Assemble the series set
        const seriesSet: IChartAssistSeries<IStatusAccessors>[] =
            this.widgetData.series.map((d: ITimeseriesWidgetData<ITimeseriesWidgetStatusData>) => ({
                ...d,
                data: this.transformData(d.data),
                accessors: this.accessors,
                renderer: this.renderer,
                scales: this.scales,
            }));

        // Update the chart
        this.chartAssist.update(seriesSet);

        if (this.configuration.enableZoom) {
            this.chartAssist.sparks.forEach(spark => {
                if (!(spark?.chart as Chart)?.hasPlugin(ZoomPlugin)) {
                    spark?.chart?.addPlugin(new ZoomPlugin({ enableExternalEvents: true }));
                }
            });

            // only need to subscribe to one chart's SET_DOMAIN_EVENT
            this.chartAssist.sparks[0].chart?.getEventBus().getStream(SET_DOMAIN_EVENT)
                .pipe(takeUntil(merge(this.chartUpdate$, (this.chartAssist.sparks[0].chart as Chart)?.eventBus.getStream(DESTROY_EVENT), this.buildChart$)))
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

    protected transformData(data: ITimeseriesWidgetStatusData[]): IStatusData[] {
        const statusDataArray: any[] = [];
        data.forEach((d, i) => {
            if (data.length - 1 !== i) {
                statusDataArray.push({
                    start: d.x,
                    end: (i < data.length - 1) ? data[i + 1].x : d.x,
                    status: d.y,
                    color: d.color,
                    thick: d.thick,
                    icon: d.icon,
                });
            }
        });
        return statusDataArray;
    }

}

interface IStatusData {
    start: Date;
    end: Date;
    thick?: boolean;
    color?: string;
    icon?: string;
}
