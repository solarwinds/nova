import {Component, OnInit} from "@angular/core";
import {
    Chart,
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    TimeScale,
    XYGrid
} from "@solarwinds/nova-charts";
import moment from "moment/moment";

@Component({
    selector: "line-chart-with-2y-axes-example",
    templateUrl: "./line-chart-with-2y-axes-example.component.html",
})
export class LineChartWith2YAxesExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit() {
        const xScale = new TimeScale();
        const yLeftScale = new LinearScale();
        yLeftScale.formatters.tick = (value: Number) => `${value}%`;

        const yRightScale = new LinearScale();
        yRightScale.formatters.tick = (value: Number) => `${value}G`;

        const xyGrid = new XYGrid();

        // Set the grid's left and right scale id's using the id's of the corresponding scales
        xyGrid.leftScaleId = yLeftScale.id;
        xyGrid.rightScaleId = yRightScale.id;

        // Set the grid's 'axis.left.fit' property to 'true' to accommodate the extra label width required by the
        // left scale's tick formatter output (Note: 'axis.right.fit' is true by default.).
        xyGrid.config().axis.left.fit = true;

        this.chart = new Chart(xyGrid);

        const accessors = new LineAccessors();
        const renderer = new LineRenderer();
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales : {
                x: xScale,
                // In this case, we're using the right-hand scale only for "series-3"
                y: d.id === "series-3" ? yRightScale : yLeftScale,
            }})
        );

        // chart assist needs to be used to update data
        this.chart.update(seriesSet);
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
    ];
}
