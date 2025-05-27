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
import moment, { duration } from "moment/moment";

import {
    barAccessors,
    BarRenderer,
    Chart,
    ChartPalette,
    CHART_PALETTE_CS1,
    LineAccessors,
    LinearScale,
    LineRenderer,
    Scales,
    TimeIntervalScale,
    XYGrid,
    ZoomPlugin,
} from "@nova-ui/charts";

const format = "YYYY-MM-DDTHH:mm:ssZ";

@Component({
    selector: "nui-line-time-series-test",
    templateUrl: "./line-time-series-test.component.html",
})
export class LineTimeSeriesTestComponent implements OnInit {
    // XYGrid is used for rendering the axes
    public chart = new Chart(new XYGrid());
    public palette = new ChartPalette(CHART_PALETTE_CS1);

    public ngOnInit(): void {
        this.chart.addPlugin(new ZoomPlugin());

        // In case of a line chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: Scales = {
            x: new TimeIntervalScale(duration(5, "minutes")).fixDomain([
                moment("2016-12-25T14:30:00Z", format).toDate(),
                moment("2016-12-25T18:00:00Z", format).toDate(),
            ]),
            y: new LinearScale(),
        };
        const lines = this.getLines(scales);
        const bars = this.getBars(scales);

        this.chart.update([...lines, ...bars]);
    }

    private getLines(scales: Scales) {
        // The line renderer will make the chart look like a line chart.
        const renderer = new LineRenderer();
        const accessors = new LineAccessors();
        accessors.series.color = (seriesId, series) =>
            this.palette.standardColors.get(series.name);

        return [
            {
                id: "series-1",
                name: "Series 1",
                data: [
                    {
                        x: moment("2016-12-25T15:00:00Z", format).toDate(),
                        y: 30,
                    },
                    {
                        x: moment("2016-12-25T15:21:00Z", format).toDate(),
                        y: 95,
                    },
                    {
                        x: moment("2016-12-25T15:44:00Z", format).toDate(),
                        y: 15,
                    },
                    {
                        x: moment("2016-12-25T16:00:00Z", format).toDate(),
                        y: 60,
                    },
                    {
                        x: moment("2016-12-25T17:30:00Z", format).toDate(),
                        y: 35,
                    },
                ],
            },
            {
                id: "series-2",
                name: "Series 2",
                data: [
                    {
                        x: moment("2016-12-25T15:00:00Z", format).toDate(),
                        y: 60,
                    },
                    {
                        x: moment("2016-12-25T15:10:00Z", format).toDate(),
                        y: 40,
                    },
                    {
                        x: moment("2016-12-25T15:45:00Z", format).toDate(),
                        y: 70,
                    },
                    {
                        x: moment("2016-12-25T16:15:00Z", format).toDate(),
                        y: 45,
                    },
                    {
                        x: moment("2016-12-25T17:20:00Z", format).toDate(),
                        y: 90,
                    },
                ],
            },
        ].map((s) => ({
            ...s,
            scales,
            renderer,
            accessors,
        }));
    }

    private getBars(scales: Scales) {
        // The line renderer will make the chart look like a line chart.
        const renderer = new BarRenderer();
        const accessors = barAccessors(
            undefined,
            this.palette.backgroundColors
        );
        accessors.data.start = (d) => d.value / 2;
        accessors.data.end = (d) => d.value * 1.5;

        return [
            {
                id: "bars-1",
                name: "Series 1",
                data: [
                    {
                        category: moment(
                            "2016-12-25T15:00:00Z",
                            format
                        ).toDate(),
                        value: 30,
                    },
                    {
                        category: moment(
                            "2016-12-25T15:20:00Z",
                            format
                        ).toDate(),
                        value: 95,
                    },
                    {
                        category: moment(
                            "2016-12-25T15:40:00Z",
                            format
                        ).toDate(),
                        value: 15,
                    },
                    {
                        category: moment(
                            "2016-12-25T16:00:00Z",
                            format
                        ).toDate(),
                        value: 60,
                    },
                    {
                        category: moment(
                            "2016-12-25T17:30:00Z",
                            format
                        ).toDate(),
                        value: 35,
                    },
                ],
            },
            {
                id: "bars-2",
                name: "Series 2",
                data: [
                    {
                        category: moment(
                            "2016-12-25T15:00:00Z",
                            format
                        ).toDate(),
                        value: 60,
                    },
                    {
                        category: moment(
                            "2016-12-25T15:10:00Z",
                            format
                        ).toDate(),
                        value: 40,
                    },
                    {
                        category: moment(
                            "2016-12-25T15:45:00Z",
                            format
                        ).toDate(),
                        value: 70,
                    },
                    {
                        category: moment(
                            "2016-12-25T16:15:00Z",
                            format
                        ).toDate(),
                        value: 45,
                    },
                    {
                        category: moment(
                            "2016-12-25T17:20:00Z",
                            format
                        ).toDate(),
                        value: 90,
                    },
                ],
            },
        ].map((s) => ({
            ...s,
            scales,
            renderer,
            accessors,
        }));
    }
}
