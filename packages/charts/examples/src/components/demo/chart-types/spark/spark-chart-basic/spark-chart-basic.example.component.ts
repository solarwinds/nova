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
    Chart,
    IChart,
    IChartSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    sparkChartGridConfig,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-spark-chart-basic-example",
    templateUrl: "./spark-chart-basic.example.component.html",
})
export class SparkChartBasicExampleComponent implements OnInit {
    public chart: IChart;

    public ngOnInit(): void {
        // This grid configuration is what turns a regular chart into a spark chart
        const gridConfig = sparkChartGridConfig(
            new XYGridConfig(),
            false,
            false
        );
        gridConfig.interactive = false;

        // Create an x-y grid by passing the spark chart grid config as an argument to the constructor
        const grid = new XYGrid(gridConfig);

        // Instantiate the chart using the configured sprk chart grid as an argument to the chart's constructor
        this.chart = new Chart(grid);

        // Generate line accessors, x-y scales, and a line renderer to be included in the IChartSeries collection
        const accessors = new LineAccessors();
        const renderer = new LineRenderer();
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        // Assemble the series set
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors,
                renderer,
                scales,
            })
        );

        // Invoke the chart's update method with the IChartSeries collection as the argument
        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "1",
            name: "Series 1",
            data: [
                { x: moment("2018-07-08T01:51:43.448Z", format), y: 62 },
                { x: moment("2018-07-21T17:35:10.344Z", format), y: 57 },
                { x: moment("2018-08-04T09:18:37.241Z", format), y: 99 },
                { x: moment("2018-08-18T01:02:04.137Z", format), y: 75 },
                { x: moment("2018-08-31T16:45:31.034Z", format), y: 55 },
                { x: moment("2018-09-14T08:28:57.931Z", format), y: 73 },
                { x: moment("2018-09-28T00:12:24.827Z", format), y: 69 },
                { x: moment("2018-10-11T15:55:51.724Z", format), y: 77 },
                { x: moment("2018-10-25T07:39:18.620Z", format), y: 57 },
                { x: moment("2018-11-07T23:22:45.517Z", format), y: 61 },
                { x: moment("2018-11-21T15:06:12.413Z", format), y: 68 },
                { x: moment("2018-12-05T06:49:39.310Z", format), y: 82 },
                { x: moment("2018-12-18T22:33:06.206Z", format), y: 81 },
                { x: moment("2019-01-01T14:16:33.103Z", format), y: 78 },
                { x: moment("2019-01-15T06:00:00.000Z", format), y: 90 },
            ],
        },
    ];
}
