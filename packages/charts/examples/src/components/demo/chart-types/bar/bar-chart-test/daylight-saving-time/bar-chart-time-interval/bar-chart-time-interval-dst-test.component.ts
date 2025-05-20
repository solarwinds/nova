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

import { Component, Input, OnInit } from "@angular/core";
import moment from "moment/moment";

import {
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    Chart,
    IAccessors,
    IChartSeries,
    IDataSeries,
    InteractionLabelPlugin,
    LinearScale,
    Scales,
    TimeIntervalScale,
} from "@nova-ui/charts";

@Component({
    selector: "bar-chart-time-interval-dst-test",
    templateUrl: "./bar-chart-time-interval-dst-test.component.html",
})
export class BarChartTimeIntervalDstTestComponent implements OnInit {
    @Input() data: Partial<IDataSeries<IAccessors>>[];
    @Input() interval: moment.Duration;

    public chart = new Chart(barGrid());

    public ngOnInit(): void {
        const accessors = barAccessors();
        accessors.data.category = (d) => d.x;
        accessors.data.value = (d) => d.y;

        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
            pointerEvents: false,
        });

        const scales: Scales = {
            x: new TimeIntervalScale(this.interval),
            y: new LinearScale(),
        };

        this.chart.addPlugin(new InteractionLabelPlugin());
        this.chart.update(
            this.data.map((s: Partial<IDataSeries<IAccessors>>) => ({
                ...s,
                accessors,
                renderer,
                scales,
            })) as IChartSeries<IAccessors>[]
        );
    }
}
