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
    barGrid,
    BarRenderer,
    Chart,
    LinearScale,
    Scales,
    TimeIntervalScale,
} from "@nova-ui/charts";

@Component({
    selector: "nui-time-interval-test",
    templateUrl: "./time-interval.test.component.html",
})
export class TimeIntervalTestComponent implements OnInit {
    public chart = new Chart(barGrid());

    public ngOnInit(): void {
        const accessors = barAccessors();
        accessors.data.category = (d) => d.x;
        accessors.data.value = (d) => d.y;

        const renderer = new BarRenderer();

        const scales: Scales = {
            x: new TimeIntervalScale(duration(1, "days")),
            y: new LinearScale(),
        };

        this.chart.update(
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
    const format = "YYYY-MM-DDTHH";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2020-07-01T0", format).toDate(), y: 30 },
                { x: moment("2020-07-02T0", format).toDate(), y: 95 },
                { x: moment("2020-07-03T0", format).toDate(), y: 15 },
                { x: moment("2020-07-04T0", format).toDate(), y: 60 },
                { x: moment("2020-07-05T0", format).toDate(), y: 35 },
            ],
        },
    ];
}
