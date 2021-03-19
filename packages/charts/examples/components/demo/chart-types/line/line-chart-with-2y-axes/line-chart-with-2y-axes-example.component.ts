import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    IChartEvent,
    IChartSeries,
    ILineAccessors,
    IXYGridOpacityEventPayload,
    LineAccessors,
    LinearScale,
    LineRenderer,
    TimeScale, XYGrid, XY_GRID_AXES_OPACITY_EVENT
} from "@nova-ui/charts";
import moment from "moment/moment";
import { Subject } from "rxjs";

@Component({
    selector: "line-chart-with-2y-axes-example",
    templateUrl: "./line-chart-with-2y-axes-example.component.html",
})
export class LineChartWith2YAxesExampleComponent implements OnInit, OnDestroy {
    public chart: Chart;
    public chartAssist: ChartAssist;

    public yLeftScale: LinearScale;
    public yRightScale: LinearScale;
    public axesOpacity: IXYGridOpacityEventPayload;

    private destroy$ = new Subject();

    public get leftAxisOpacity() {
        return this.axesOpacity?.[this.yLeftScale.id] ?? 1;
    }

    public get rightAxisOpacity() {
        return this.axesOpacity?.[this.yRightScale.id] ?? 1;
    }

    constructor(public changeDetector: ChangeDetectorRef) {
    }

    public ngOnInit() {
        const xScale = new TimeScale();
        this.yLeftScale = new LinearScale();
        this.yLeftScale.formatters.tick = (value: Number) => `${value}%`;

        this.yRightScale = new LinearScale();
        this.yRightScale.formatters.tick = (value: Number) => `${value}G`;

        const xyGrid = new XYGrid();

        // Set the grid's left and right scale id's using the id's of the corresponding scales
        xyGrid.leftScaleId = this.yLeftScale.id;
        xyGrid.rightScaleId = this.yRightScale.id;

        // Set the grid's 'axis.left.fit' property to 'true' to accommodate the extra label width required by the
        // left scale's tick formatter output (Note: 'axis.right.fit' is true by default.).
        xyGrid.config().axis.left.fit = true;

        this.chart = new Chart(xyGrid);
        this.chartAssist = new ChartAssist(this.chart);

        const accessors = new LineAccessors();
        const renderer = new LineRenderer();
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales: {
                x: xScale,
                // In this case, we're using the right-hand scale only for "series-3"
                y: d.id === "series-3" ? this.yRightScale : this.yLeftScale,
            },
            unitLabel: d.id === "series-3" ? "GB" : "%",
        }));

        // chart assist needs to be used to update data
        this.chartAssist.update(seriesSet);

        //
        this.chart.eventBus.getStream(XY_GRID_AXES_OPACITY_EVENT).subscribe((event: IChartEvent<IXYGridOpacityEventPayload>) => {
            this.axesOpacity = event.data;
            this.changeDetector.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Average CPU Load",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 30 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 95 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 15 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 60 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 35 },
            ],
        },
        {
            id: "series-2",
            name: "Packet Loss",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 60 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 40 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 70 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 45 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 90 },
            ],
        },
        {
            id: "series-3",
            name: "Average Memory Used",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 30 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 10 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 75 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 22 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 90 },
            ],
        },
        {
            id: "series-4",
            name: "No data",
            data: [],
        },
    ];
}
