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

import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";

import {
    IChartAssistSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    SparkChartAssist,
    TimeScale,
} from "@nova-ui/charts";

@Component({
    selector: "nui-spark-chart-multiple-example",
    templateUrl: "./spark-chart-multiple.example.component.html",
})
export class SparkChartMultipleExampleComponent implements OnInit {
    public chartAssist: SparkChartAssist;

    public ngOnInit(): void {
        // spark chart setup
        this.chartAssist = new SparkChartAssist();

        // providing chartAssist colors and markers to LineAccessors will share them with the line chart
        const accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );
        const renderer = new LineRenderer();

        const seriesSet: IChartAssistSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors,
                renderer,
                scales: {
                    // using the same scale id for the x-axes is necessary to achieve synchronized hover interaction between charts
                    // - sharing the same instance of the scale would work as well
                    x: new TimeScale("shared-id"),
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
    ];
}
