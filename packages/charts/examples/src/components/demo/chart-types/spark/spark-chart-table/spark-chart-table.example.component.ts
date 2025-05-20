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
    ChartPopoverPlugin,
    IChartAssistSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    SparkChartAssist,
    TimeScale,
} from "@nova-ui/charts";

@Component({
    selector: "nui-spark-chart-table-example",
    templateUrl: "./spark-chart-table.example.component.html",
})
export class SparkChartTableExampleComponent implements OnInit {
    public displayedColumns = ["name", "chart"];
    public dataSource: any[] = [];

    public ngOnInit(): void {
        this.generateTableData();
    }

    private generateTableData() {
        const renderer = new LineRenderer();

        this.dataSource = getData().map((d, i: number) => {
            // Chart assist setup
            const chartAssist = new SparkChartAssist(false, false);

            // using a new accessors instance for each spark allows for the sequential
            // color provider within to provide the same color for each sparkline
            const accessors = new LineAccessors();
            const yScale = new LinearScale();
            yScale.formatters.value = (v) => Number(v).toPrecision(4);
            const scales: IXYScales = {
                // using the same scale id for the x-axes is necessary to achieve synchronized hover interaction between charts
                // - sharing the same instance of the scale would work as well
                x: new TimeScale("shared-id"),
                y: yScale,
            };

            // series setup
            const dataSeries: IChartAssistSeries<ILineAccessors> = {
                id: `spark-series-${i + 1}`,
                name: d.node,
                data: d.cpu,
                accessors,
                renderer,
                scales,
            };

            // chart assist needs to be used to update data
            chartAssist.update([dataSeries]);

            // popover plugin must be added after the initial update as the spark chart assist creates the sparks on update
            const popoverPlugin = new ChartPopoverPlugin();
            chartAssist.sparks[0].chart?.addPlugin(popoverPlugin);

            // assembly of table row data
            const row = { ...d, chartAssist, popoverPlugin };
            return row;
        });
    }
}

/* Chart data */
function getData(): any[] {
    const format = "YYYY-MM-DDTHH:mm:ssZ";
    return [
        {
            node: "Tex-lab-aus-2621",
            cpu: [
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
            node: "Cz-lab-brn-02",
            cpu: [
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
    ];
}
