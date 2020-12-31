import { Component, OnInit } from "@angular/core";
import { Chart, IChartSeries, ILineAccessors, IXYScales, LineAccessors, LinearScale, LineRenderer, TimeScale, XYGrid } from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "nui-line-chart-basic-example",
    templateUrl: "./line-chart-basic.example.component.html",
})
export class LineChartBasicExampleComponent implements OnInit {
    // XYGrid is used for rendering axes and other grid elements
    public chart = new Chart(new XYGrid());

    public ngOnInit() {
        // Line accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors = new LineAccessors();

        // The line renderer will make the chart look like a line chart.
        const renderer = new LineRenderer();

        // In case of a line chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        // Here we assemble the complete chart series.
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        // Finally, pass the series set to the chart's update method
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
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 60 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 40 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 70 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 45 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 90 },
            ],
        },
    ];
}
