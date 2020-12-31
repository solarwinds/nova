import { Component, OnInit } from "@angular/core";
import { Chart, IChartSeries, ILineAccessors, LineAccessors, LinearScale, LineRenderer, TimeScale, XYGrid } from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "nui-chart-tick-formatter-example",
    templateUrl: "./tick-formatter.example.component.html",
})
export class TickFormatterExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit() {
        const scales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        scales.y.formatters.tick = (value: Number) => `> ${value} %`;

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            accessors: new LineAccessors(),
            renderer: new LineRenderer(),
            scales,
        }));

        const grid = new XYGrid();
        // Set the grid's 'axis.left.fit' property to 'true' to accommodate the extra label width required by the y-scale's tick formatter output.
        grid.config().axis.left.fit = true;
        this.chart = new Chart(grid);

        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 30 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 95 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 15 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 60 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 35 },
            ],
        },
    ];
}
