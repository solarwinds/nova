import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    IChartSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "line-chart-with-large-values-example",
    templateUrl: "./line-chart-with-large-values.example.component.html",
})
export class LineChartWithLargeValuesExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());

    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public ngOnInit(): void {
        // providing chartAssist colors and markers to LineAccessors will share them with the line chart
        const accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );
        const renderer = new LineRenderer();
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors,
                renderer,
                scales,
            })
        );

        (this.chart.getGrid().config() as XYGridConfig).axis.left.fit = true;

        // chart assist needs to be used to update data
        this.chartAssist.update(seriesSet);
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
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 3000 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 9500 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 1500 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 6000 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 3500 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 6000 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 4000 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 7000 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 4500 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 9000 },
            ],
        },
    ];
}
