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
    ChartPopoverPlugin,
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
    selector: "line-chart-popover-prototype",
    templateUrl: "./line-chart-popover-prototype.component.html",
})
export class LineChartPopoverPrototypeComponent implements OnInit {
    public chart = new Chart(new XYGrid());

    public chartAssist: ChartAssist = new ChartAssist(this.chart);
    public popoverPlugin = new ChartPopoverPlugin();

    public ngOnInit(): void {
        const scales: IXYScales = {
            x: new TimeScale("x"),
            y: new LinearScale(),
        };
        const renderer = new LineRenderer();
        // providing chartAssist colors and markers to LineAccessors will share them with the line chart
        const accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (s) => ({
                ...s,
                scales,
                renderer,
                accessors,
            })
        );

        // plugin setup
        this.chart.addPlugin(this.popoverPlugin);

        // chart assist needs to be used to update data
        this.chartAssist.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";
    const baseDate = "2016-12-25T15:14:29.909Z";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment(baseDate, format), y: 30 },
                { x: moment(baseDate, format).add(1, "day"), y: 95 },
                { x: moment(baseDate, format).add(2, "day"), y: 15 },
                { x: moment(baseDate, format).add(3, "day"), y: 60 },
                { x: moment(baseDate, format).add(4, "day"), y: 35 },
                { x: moment(baseDate, format).add(5, "day"), y: 35 },
                { x: moment(baseDate, format).add(6, "day"), y: 95 },
                { x: moment(baseDate, format).add(7, "day"), y: 15 },
                { x: moment(baseDate, format).add(8, "day"), y: 60 },
                { x: moment(baseDate, format).add(9, "day"), y: 35 },
                { x: moment(baseDate, format).add(10, "day"), y: 35 },
                { x: moment(baseDate, format).add(11, "day"), y: 95 },
                { x: moment(baseDate, format).add(12, "day"), y: 15 },
                { x: moment(baseDate, format).add(13, "day"), y: 60 },
                { x: moment(baseDate, format).add(14, "day"), y: 35 },
                { x: moment(baseDate, format).add(15, "day"), y: 35 },
                { x: moment(baseDate, format).add(16, "day"), y: 95 },
                { x: moment(baseDate, format).add(17, "day"), y: 15 },
                { x: moment(baseDate, format).add(18, "day"), y: 60 },
                { x: moment(baseDate, format).add(19, "day"), y: 35 },
                { x: moment(baseDate, format).add(20, "day"), y: 35 },
                { x: moment(baseDate, format).add(21, "day"), y: 95 },
                { x: moment(baseDate, format).add(22, "day"), y: 15 },
                { x: moment(baseDate, format).add(23, "day"), y: 60 },
                { x: moment(baseDate, format).add(24, "day"), y: 35 },
                { x: moment(baseDate, format).add(25, "day"), y: 35 },
                { x: moment(baseDate, format).add(26, "day"), y: 95 },
                { x: moment(baseDate, format).add(27, "day"), y: 15 },
                { x: moment(baseDate, format).add(28, "day"), y: 60 },
                { x: moment(baseDate, format).add(29, "day"), y: 35 },
                { x: moment(baseDate, format).add(30, "day"), y: 35 },
                { x: moment(baseDate, format).add(31, "day"), y: 95 },
                { x: moment(baseDate, format).add(32, "day"), y: 15 },
                { x: moment(baseDate, format).add(33, "day"), y: 60 },
                { x: moment(baseDate, format).add(34, "day"), y: 35 },
                { x: moment(baseDate, format).add(35, "day"), y: 35 },
                { x: moment(baseDate, format).add(36, "day"), y: 95 },
                { x: moment(baseDate, format).add(37, "day"), y: 15 },
                { x: moment(baseDate, format).add(38, "day"), y: 60 },
                { x: moment(baseDate, format).add(39, "day"), y: 35 },
                { x: moment(baseDate, format).add(40, "day"), y: 35 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: moment(baseDate, format), y: 60 },
                { x: moment(baseDate, format).add(1, "day"), y: 40 },
                { x: moment(baseDate, format).add(3, "day"), y: 70 },
                { x: moment(baseDate, format).add(5, "day"), y: 45 },
                { x: moment(baseDate, format).add(7, "day"), y: 90 },
                { x: moment(baseDate, format).add(9, "day"), y: 90 },
                { x: moment(baseDate, format).add(11, "day"), y: 40 },
                { x: moment(baseDate, format).add(13, "day"), y: 70 },
                { x: moment(baseDate, format).add(15, "day"), y: 45 },
                { x: moment(baseDate, format).add(17, "day"), y: 90 },
                { x: moment(baseDate, format).add(19, "day"), y: 90 },
                { x: moment(baseDate, format).add(21, "day"), y: 40 },
                { x: moment(baseDate, format).add(23, "day"), y: 70 },
                { x: moment(baseDate, format).add(25, "day"), y: 45 },
                { x: moment(baseDate, format).add(27, "day"), y: 90 },
                { x: moment(baseDate, format).add(29, "day"), y: 90 },
                { x: moment(baseDate, format).add(31, "day"), y: 40 },
                { x: moment(baseDate, format).add(33, "day"), y: 70 },
                { x: moment(baseDate, format).add(35, "day"), y: 45 },
                { x: moment(baseDate, format).add(37, "day"), y: 90 },
                { x: moment(baseDate, format).add(39, "day"), y: 90 },
            ],
        },
    ];
}
