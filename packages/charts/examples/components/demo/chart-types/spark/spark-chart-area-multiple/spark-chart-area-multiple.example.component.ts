import { Component, OnInit } from "@angular/core";
import {
    AreaRenderer,
    IAreaAccessors,
    IChartAssistSeries,
    LinearScale,
    SparkChartAssist,
    TimeScale,
    stackedAreaAccessors,
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "nui-spark-chart-area-multiple-example",
    templateUrl: "./spark-chart-area-multiple.example.component.html",
})
export class SparkChartAreaMultipleExampleComponent implements OnInit {
    public chartAssist: SparkChartAssist;

    public ngOnInit() {
        // spark chart setup
        this.chartAssist = new SparkChartAssist();

        // Stacked Area accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        // providing chartAssist colors and markers to stackedAreaAccessors will share them with the area chart
        const accessors = stackedAreaAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );
        // setting the AreaRenderer congif's strokeWidth to zero so no stroke is added around the filled area
        const renderer = new AreaRenderer({ strokeWidth: 0 });

        const seriesSet: IChartAssistSeries<IAreaAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors,
                renderer,
                scales: {
                    // using the same scale id for the x-axes is necessary to achieve synchronized hover interaction between charts
                    // - sharing the same instance of the scale would work as well
                    x: new TimeScale("shared_id"),
                    y: new LinearScale(),
                },
            })
        );

        // chart assist needs to be used to update data
        this.chartAssist.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "spark-series-1",
            name: "Tex-lab-aus-2621",
            data: [
                { x: moment("2018-07-08T01:51:43.448Z", format), y: 85 },
                { x: moment("2018-07-21T17:35:10.344Z", format), y: 57 },
                { x: moment("2018-08-04T09:18:37.241Z", format), y: 99 },
                { x: moment("2018-08-18T01:02:04.137Z", format), y: 75 },
                { x: moment("2018-08-31T16:45:31.034Z", format), y: 55 },
                { x: moment("2018-09-14T08:28:57.931Z", format), y: 73 },
                { x: moment("2018-09-28T00:12:24.827Z", format), y: 30 },
                { x: moment("2018-10-11T15:55:51.724Z", format), y: 77 },
                { x: moment("2018-10-25T07:39:18.620Z", format), y: 57 },
                { x: moment("2018-11-07T23:22:45.517Z", format), y: 61 },
            ],
        },
        {
            id: "spark-series-2",
            name: "Cz-lab-brn-02",
            data: [
                { x: moment("2018-07-08T01:51:43.448Z", format), y: 93 },
                { x: moment("2018-07-21T17:35:10.344Z", format), y: 71 },
                { x: moment("2018-08-04T09:18:37.241Z", format), y: 85 },
                { x: moment("2018-08-18T01:02:04.137Z", format), y: 54 },
                { x: moment("2018-08-31T16:45:31.034Z", format), y: 79 },
                { x: moment("2018-09-14T08:28:57.931Z", format), y: 64 },
                { x: moment("2018-09-28T00:12:24.827Z", format), y: 49 },
                { x: moment("2018-10-11T15:55:51.724Z", format), y: 70 },
                { x: moment("2018-10-25T07:39:18.620Z", format), y: 59 },
                { x: moment("2018-11-07T23:22:45.517Z", format), y: 76 },
            ],
        },
        {
            id: "spark-series-3",
            name: "Ua-lab-kie-03",
            data: [
                { x: moment("2018-07-08T01:51:43.448Z", format), y: 60 },
                { x: moment("2018-07-21T17:35:10.344Z", format), y: 75 },
                { x: moment("2018-08-04T09:18:37.241Z", format), y: 42 },
                { x: moment("2018-08-18T01:02:04.137Z", format), y: 84 },
                { x: moment("2018-08-31T16:45:31.034Z", format), y: 41 },
                { x: moment("2018-09-14T08:28:57.931Z", format), y: 50 },
                { x: moment("2018-09-28T00:12:24.827Z", format), y: 56 },
                { x: moment("2018-10-11T15:55:51.724Z", format), y: 44 },
                { x: moment("2018-10-25T07:39:18.620Z", format), y: 75 },
                { x: moment("2018-11-07T23:22:45.517Z", format), y: 48 },
            ],
        },
        {
            id: "spark-series-4",
            name: "Tex-lab-kie-3203",
            data: [
                { x: moment("2018-07-08T01:51:43.448Z", format), y: 30 },
                { x: moment("2018-07-21T17:35:10.344Z", format), y: 25 },
                { x: moment("2018-08-04T09:18:37.241Z", format), y: 84 },
                { x: moment("2018-08-18T01:02:04.137Z", format), y: 44 },
                { x: moment("2018-08-31T16:45:31.034Z", format), y: 56 },
                { x: moment("2018-09-14T08:28:57.931Z", format), y: 70 },
                { x: moment("2018-09-28T00:12:24.827Z", format), y: 15 },
                { x: moment("2018-10-11T15:55:51.724Z", format), y: 27 },
                { x: moment("2018-10-25T07:39:18.620Z", format), y: 85 },
                { x: moment("2018-11-07T23:22:45.517Z", format), y: 30 },
            ],
        },
    ];
}
