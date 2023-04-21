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
    ChartAssist,
    IChartSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-line-chart-with-legend-example",
    templateUrl: "./line-chart-with-legend.example.component.html",
})
export class LineChartWithLegendExampleComponent implements OnInit {
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
                scales,
                renderer,
                accessors,
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
