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
// eslint-disable-next-line no-restricted-imports
import moment, { duration } from "moment";

import {
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    BarTooltipsPlugin,
    Chart,
    ChartAssist,
    InteractionLabelPlugin,
    LinearScale,
    stack,
    TimeIntervalScale,
} from "@nova-ui/charts";

@Component({
    selector: "stacked-bar-prototype",
    templateUrl: "./stacked-bar-prototype.component.html",
})
export class StackedBarPrototypeComponent implements OnInit {
    public chartAssist: ChartAssist;
    public tooltipsPlugin = new BarTooltipsPlugin();

    public ngOnInit(): void {
        const chart = new Chart(barGrid());

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(new InteractionLabelPlugin());
        chart.addPlugin(this.tooltipsPlugin);

        // "stack" is a function that calls data preprocessor for recalculating stacks
        this.chartAssist = new ChartAssist(chart, stack);

        const accessors = barAccessors();
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });
        // const scales = barScales();
        const scales = {
            y: new LinearScale(),
            x: new TimeIntervalScale(duration(1, "day")),
        };

        accessors.data.value = (data: any) => data.value;
        accessors.data.category = (data: any) =>
            moment(data.time, "YYYY-MM-DD HH:mm:ss").toDate();
        this.chartAssist.update(
            getData().map((s) => ({
                ...s,
                accessors,
                renderer,
                scales,
            }))
        );
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "TAMA:1433",

            data: [
                {
                    time: "2020-08-29T00:00:00.000-05:00",
                    value: 16.216666666666665,
                },
                {
                    time: "2020-08-30T00:00:00.000-05:00",
                    value: 14.633333333333333,
                },
                {
                    time: "2020-08-31T00:00:00.000-05:00",
                    value: 13.816666666666666,
                },
                {
                    time: "2020-09-01T00:00:00.000-05:00",
                    value: 9.883333333333333,
                },
                {
                    time: "2020-09-02T00:00:00.000-05:00",
                    value: 2.0166666666666666,
                },
                {
                    time: "2020-09-03T00:00:00.000-05:00",
                    value: 8.633333333333333,
                },
                {
                    time: "2020-09-04T00:00:00.000-05:00",
                    value: 9.716666666666667,
                },
                {
                    time: "2020-09-05T00:00:00.000-05:00",
                    value: 13.183333333333334,
                },
                {
                    time: "2020-09-06T00:00:00.000-05:00",
                    value: 13.216666666666667,
                },
                {
                    time: "2020-09-07T00:00:00.000-05:00",
                    value: 12.566666666666666,
                },
                {
                    time: "2020-09-08T00:00:00.000-05:00",
                    value: 12.483333333333333,
                },
                {
                    time: "2020-09-09T00:00:00.000-05:00",
                    value: 12.633333333333333,
                },
                {
                    time: "2020-09-10T00:00:00.000-05:00",
                    value: 10.85,
                },
                {
                    time: "2020-09-11T00:00:00.000-05:00",
                    value: 7.716666666666667,
                },
            ],
        },
        {
            id: "DPAPOST114EDBOR.IGNITE.LOCAL:5444",
            data: [
                //     {
                //     "time": "2020-08-29T00:00:00.000-05:00",
                //     "value": 5.1,
                // }, {
                //     "time": "2020-08-30T00:00:00.000-05:00",
                //     "value": 1.6333333333333333,
                // }, {
                //     "time": "2020-08-31T00:00:00.000-05:00",
                //     "value": 14.633333333333333,
                // },
                {
                    time: "2020-09-01T00:00:00.000-05:00",
                    value: 15.983333333333333,
                },
                {
                    time: "2020-09-02T00:00:00.000-05:00",
                    value: 3.95,
                },
                {
                    time: "2020-09-03T00:00:00.000-05:00",
                    value: 3.033333333333333,
                },
                {
                    time: "2020-09-04T00:00:00.000-05:00",
                    value: 5.233333333333333,
                },
                {
                    time: "2020-09-05T00:00:00.000-05:00",
                    value: 1.6666666666666667,
                },
                {
                    time: "2020-09-06T00:00:00.000-05:00",
                    value: 3.4166666666666665,
                },
                {
                    time: "2020-09-07T00:00:00.000-05:00",
                    value: 1.1166666666666667,
                },
                {
                    time: "2020-09-08T00:00:00.000-05:00",
                    value: 1.25,
                },
                {
                    time: "2020-09-09T00:00:00.000-05:00",
                    value: 5.5,
                },
                // {
                //     "time": "2020-09-10T00:00:00.000-05:00",
                //     "value": 1.35,
                // }, {
                //     "time": "2020-09-11T00:00:00.000-05:00",
                //     "value": 9.75,
                // },
            ],
        },
        {
            id: "ORCL_DPAORA11ASM",
            data: [
                {
                    time: "2020-08-29T00:00:00.000-05:00",
                    value: 2.15,
                },
                {
                    time: "2020-08-30T00:00:00.000-05:00",
                    value: 2.4,
                },
                {
                    time: "2020-08-31T00:00:00.000-05:00",
                    value: 6.666666666666667,
                },
                {
                    time: "2020-09-01T00:00:00.000-05:00",
                    value: 4.866666666666666,
                },
                {
                    time: "2020-09-02T00:00:00.000-05:00",
                    value: 0.21666666666666667,
                },
                {
                    time: "2020-09-03T00:00:00.000-05:00",
                    value: 0.65,
                },
                {
                    time: "2020-09-04T00:00:00.000-05:00",
                    value: 0.6333333333333333,
                },
                {
                    time: "2020-09-05T00:00:00.000-05:00",
                    value: 2,
                },
                {
                    time: "2020-09-06T00:00:00.000-05:00",
                    value: 1.7333333333333334,
                },
                {
                    time: "2020-09-07T00:00:00.000-05:00",
                    value: 3.2333333333333334,
                },
                {
                    time: "2020-09-08T00:00:00.000-05:00",
                    value: 2.95,
                },
                {
                    time: "2020-09-09T00:00:00.000-05:00",
                    value: 2,
                },
                {
                    time: "2020-09-10T00:00:00.000-05:00",
                    value: 1.7,
                },
                {
                    time: "2020-09-11T00:00:00.000-05:00",
                    value: 1.4833333333333334,
                },
            ],
        },
        {
            id: "LUDWIG",
            data: [
                {
                    time: "2020-08-29T00:00:00.000-05:00",
                    value: 2.05,
                },
                {
                    time: "2020-08-30T00:00:00.000-05:00",
                    value: 2.1666666666666665,
                },
                {
                    time: "2020-08-31T00:00:00.000-05:00",
                    value: 2.1166666666666667,
                },
                {
                    time: "2020-09-01T00:00:00.000-05:00",
                    value: 1.3166666666666667,
                },
                {
                    time: "2020-09-02T00:00:00.000-05:00",
                    value: 0.4,
                },
                {
                    time: "2020-09-03T00:00:00.000-05:00",
                    value: 1.2833333333333334,
                },
                {
                    time: "2020-09-04T00:00:00.000-05:00",
                    value: 1.4,
                },
                {
                    time: "2020-09-05T00:00:00.000-05:00",
                    value: 2.1166666666666667,
                },
                {
                    time: "2020-09-06T00:00:00.000-05:00",
                    value: 2.0166666666666666,
                },
                {
                    time: "2020-09-07T00:00:00.000-05:00",
                    value: 2.15,
                },
                {
                    time: "2020-09-08T00:00:00.000-05:00",
                    value: 1.95,
                },
                {
                    time: "2020-09-09T00:00:00.000-05:00",
                    value: 1.8833333333333333,
                },
                {
                    time: "2020-09-10T00:00:00.000-05:00",
                    value: 1.7166666666666666,
                },
                {
                    time: "2020-09-11T00:00:00.000-05:00",
                    value: 1,
                },
            ],
        },
        {
            id: "LUDWIG-TWO",
            data: [
                {
                    time: "2020-08-29T00:00:00.000-05:00",
                    value: 2.5,
                },
                {
                    time: "2020-08-30T00:00:00.000-05:00",
                    value: 2.266666666666666,
                },
                // {
                //     "time": "2020-08-31T00:00:00.000-05:00",
                //     "value": 2.7166666666666667,
                // }, {
                //     "time": "2020-09-01T00:00:00.000-05:00",
                //     "value": 2.3166666666666667,
                // }, {
                //     "time": "2020-09-02T00:00:00.000-05:00",
                //     "value": 1.4,
                // }, {
                //     "time": "2020-09-03T00:00:00.000-05:00",
                //     "value": 1.2833333333333334,
                // },
                {
                    time: "2020-09-04T00:00:00.000-05:00",
                    value: 1.001,
                },
                {
                    time: "2020-09-05T00:00:00.000-05:00",
                    value: 2.216666666666666,
                },
                {
                    time: "2020-09-06T00:00:00.000-05:00",
                    value: 2.416666666666666,
                },
                {
                    time: "2020-09-07T00:00:00.000-05:00",
                    value: 2.45,
                },
                {
                    time: "2020-09-08T00:00:00.000-05:00",
                    value: 1.45,
                },
                {
                    time: "2020-09-09T00:00:00.000-05:00",
                    value: 1.983333333333333,
                },
                {
                    time: "2020-09-10T00:00:00.000-05:00",
                    value: 1.616666666666666,
                },
                {
                    time: "2020-09-11T00:00:00.000-05:00",
                    value: 1.9,
                },
            ],
        },
        {
            id: "DPAORA10_DPAORA10",
            data: [
                {
                    time: "2020-08-29T00:00:00.000-05:00",
                    value: 2.55,
                },
                {
                    time: "2020-08-30T00:00:00.000-05:00",
                    value: 2.6333333333333333,
                },
                {
                    time: "2020-08-31T00:00:00.000-05:00",
                    value: 2.8666666666666667,
                },
                {
                    time: "2020-09-01T00:00:00.000-05:00",
                    value: 1.1,
                },
                {
                    time: "2020-09-02T00:00:00.000-05:00",
                    value: 0.38333333333333336,
                },
                {
                    time: "2020-09-03T00:00:00.000-05:00",
                    value: 0.8,
                },
                {
                    time: "2020-09-04T00:00:00.000-05:00",
                    value: 1.1333333333333333,
                },
                {
                    time: "2020-09-05T00:00:00.000-05:00",
                    value: 1.0833333333333333,
                },
            ],
        },
    ];
}
