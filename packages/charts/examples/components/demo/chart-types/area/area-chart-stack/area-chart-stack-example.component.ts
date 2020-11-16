import { Component, OnInit } from "@angular/core";
import {
    AreaAccessors,
    areaGrid,
    AreaRenderer,
    Chart,
    ChartAssist,
    IAreaAccessors,
    IChartSeries,
    IXYScales,
    LinearScale,
    stackedArea,
    stackedAreaAccessors,
    TimeScale,
} from "@solarwinds/nova-charts";
import moment from "moment/moment";

@Component({
    selector: "area-chart-stack-example",
    templateUrl: "./area-chart-stack-example.component.html",
})
export class AreaChartStackExampleComponent implements OnInit {
    public chart: Chart;
    public chartAssist: ChartAssist;

    public ngOnInit() {
        // areaGrid returns an XYGrid configured for displaying an area chart's axes and other grid elements.
        this.chart = new Chart(areaGrid());
        // ChartAssist will use the preprocessor to stack the series' numeric values on the same progression domain
        this.chartAssist = new ChartAssist(this.chart, stackedArea);

        // Stacked Area accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors =  stackedAreaAccessors();
        // 'y1' defines access to the numeric values we want to visualize.
        // The items in the data array of this example have a property named 'value',so we'll use that.
        accessors.data.y1 = (d) => d.value;

        // The area renderer will make the chart look like a area chart.
        const renderer = new AreaRenderer();

        // In case of a area chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        // Here we assemble the complete chart series.
        const seriesSet: IChartSeries<IAreaAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        // Finally, pass the series set to the chart's update method
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
                { x: moment("2016-12-25T11:45:29.909Z", format), value: 6 },
                { x: moment("2016-12-25T12:10:29.909Z", format), value: 33 },
                { x: moment("2016-12-25T12:50:29.909Z", format), value: 15 },
                { x: moment("2016-12-25T13:15:29.909Z", format), value: 20 },
                { x: moment("2016-12-25T13:40:29.909Z", format), value: 30 },
                { x: moment("2016-12-25T13:55:29.909Z", format), value: 12 },
                { x: moment("2016-12-25T14:20:29.909Z", format), value: 6 },
                { x: moment("2016-12-25T14:40:29.909Z", format), value: 35 },
                { x: moment("2016-12-25T15:00:29.909Z", format), value: 23 },
                { x: moment("2016-12-25T15:25:29.909Z", format), value: 25 },
                { x: moment("2016-12-25T15:45:29.909Z", format), value: 38 },
                { x: moment("2016-12-25T16:10:29.909Z", format), value: 25 },
                { x: moment("2016-12-25T16:30:29.909Z", format), value: 43 },
                { x: moment("2016-12-25T16:45:29.909Z", format), value: 28 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: moment("2016-12-25T11:45:29.909Z", format), value: 12 },
                { x: moment("2016-12-25T12:10:29.909Z", format), value: 65 },
                { x: moment("2016-12-25T12:50:29.909Z", format), value: 30 },
                { x: moment("2016-12-25T13:15:29.909Z", format), value: 40 },
                { x: moment("2016-12-25T13:40:29.909Z", format), value: 60 },
                { x: moment("2016-12-25T13:55:29.909Z", format), value: 23 },
                { x: moment("2016-12-25T14:20:29.909Z", format), value: 12 },
                { x: moment("2016-12-25T14:40:29.909Z", format), value: 70 },
                { x: moment("2016-12-25T15:00:29.909Z", format), value: 45 },
                { x: moment("2016-12-25T15:25:29.909Z", format), value: 50 },
                { x: moment("2016-12-25T15:45:29.909Z", format), value: 75 },
                { x: moment("2016-12-25T16:10:29.909Z", format), value: 50 },
                { x: moment("2016-12-25T16:30:29.909Z", format), value: 85 },
                { x: moment("2016-12-25T16:45:29.909Z", format), value: 55 },
            ],
        },
    ];
}
