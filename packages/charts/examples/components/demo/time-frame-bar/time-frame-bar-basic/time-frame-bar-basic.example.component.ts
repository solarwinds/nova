import { Component, OnDestroy, OnInit } from "@angular/core";
import { HistoryStorage, IFilter, IFilteringOutputs, ITimeframe, NoopDataSourceService } from "@nova-ui/bits";
import {
    Chart, ChartAssist, getAutomaticDomainWithIncludedInterval, IAccessors, IChartAssistSeries, ISetDomainEventPayload, LineAccessors, LinearScale,
    LineRenderer, SET_DOMAIN_EVENT, TimeScale, XYGrid, ZoomPlugin,
} from "@nova-ui/charts";
import moment, { Moment } from "moment/moment";
import { Subscription } from "rxjs";

@Component({
    selector: "nui-time-frame-bar-example",
    templateUrl: "./time-frame-bar-basic.example.component.html",
    providers: [NoopDataSourceService, HistoryStorage],
})
export class TimeFrameBarBasicExampleComponent implements OnInit, OnDestroy {
    private series = getData();
    public fromDate = moment("2018-05-01 15:00:00").subtract(5.2, "days");
    public toDate = moment("2019-01-01 15:00:00");

    public chart = new Chart(new XYGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public timeFrame: ITimeframe;

    private xScale = new TimeScale("time-scale");
    private yScale = new LinearScale();
    private seriesSet: IChartAssistSeries<IAccessors>[] = [];
    private filteringSubscription: Subscription;

    constructor(public history: HistoryStorage<ITimeframe>,
                private dataSourceService: NoopDataSourceService<ITimeframe>) {
    }

    public ngOnInit() {
        const accessors = new LineAccessors(this.chartAssist.palette.standardColors, this.chartAssist.markers);
        const renderer = new LineRenderer();
        this.yScale.domainCalculator = getAutomaticDomainWithIncludedInterval([0, 100]);
        this.seriesSet = Object.keys(this.series).map((key: string) => ({
            id: key,
            name: key,
            data: buildTimeSeriesFromData(this.fromDate, this.toDate, this.series[key]),
            accessors,
            renderer,
            scales: { x: this.xScale, y: this.yScale },
        }));

        this.timeFrame = this.history.save({
            startDatetime: this.fromDate,
            endDatetime: this.toDate,
            selectedPresetId: undefined,
        });

        this.chart.addPlugins(new ZoomPlugin());

        // Update Time Frame Bar when chart got zoomed
        this.chart.getEventBus().getStream(SET_DOMAIN_EVENT).subscribe((event) => {
            const payload = <ISetDomainEventPayload>event.data;
            const newDomain = payload[this.xScale.id];
            this.timeFrame = this.history.save({
                startDatetime: moment(newDomain[0]),
                endDatetime: moment(newDomain[1]),
                selectedPresetId: undefined,
            });

            void this.dataSourceService.applyFilters();
        });

        this.filteringSubscription = this.setUpFiltering();

        void this.dataSourceService.applyFilters();
    }

    public ngOnDestroy() {
        if (this.filteringSubscription) {
            this.filteringSubscription.unsubscribe();
        }
    }

    public updateTimeFrame(value: ITimeframe) {
        this.timeFrame = this.history.restart(value);
        void this.dataSourceService.applyFilters();
    }

    // Use the history storage to go back one time frame
    public zoomUndo() {
        this.timeFrame = this.history.undo();
        void this.dataSourceService.applyFilters();
    }

    // Reset the history storage and save a new initial value if provided
    // Otherwise preserve the previous one
    public zoomReset(value?: ITimeframe) {
        this.timeFrame = this.history.restart(value);
        void this.dataSourceService.applyFilters();
    }

    private setUpFiltering(): any {
        this.dataSourceService.registerComponent({
            timeframe: {
                componentInstance: {
                    getFilters: () => <IFilter<ITimeframe>>({
                        type: "ITimeframe",
                        value: this.timeFrame,
                    }),
                },
            },
        });

        return this.dataSourceService.outputsSubject.subscribe((data: IFilteringOutputs) => {
            this.xScale.fixDomain([data.timeframe.value.startDatetime.toDate(), data.timeframe.value.endDatetime.toDate()]);
            this.chartAssist.update(this.seriesSet);
        });
    }
}

/* Chart data */
function getData(): Record<string, number[]> {
    return {
        "Tex-lab-aus-2621": [18, 27, 35, 33, 26, 50, 36, 47, 58, 66, 65, 50, 40, 31, 42, 62, 57, 99, 75, 55, 73, 69, 77, 57, 61, 68, 82, 81, 78, 67],
        "Cz-lab-brn-02": [41, 50, 56, 40, 44, 35, 27, 42, 38, 23, 20, 13, 29, 42, 84, 93, 71, 60, 54, 79, 64, 49, 48, 59, 76, 63, 52, 84, 89, 80],
    };
}

function buildTimeSeriesFromData(from: Moment, to: Moment, data: number[]): { x: Moment, y: number }[] {
    const count = data.length;
    if (!from || !to || count === 0) {
        return [];
    }

    const interval = count > 1 ? to.diff(from) / (count - 1) : 0;
    return data.map((y, i) => ({
        x: from.clone().add(moment.duration(i * interval)),
        y,
    }));
}
