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

import {
    barAccessors,
    barGrid,
    BarRenderer,
    barScales,
    Chart,
    IBarChartConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-horizontal-example",
    templateUrl: "./bar-chart-horizontal.example.component.html",
})
export class BarChartHorizontalExampleComponent implements OnInit {
    public barConfig: IBarChartConfig = { horizontal: true };
    public chart = new Chart(barGrid(this.barConfig));

    public ngOnInit(): void {
        const accessors = barAccessors(this.barConfig);
        const renderer = new BarRenderer();
        const scales = barScales(this.barConfig);

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
    return [
        { id: "chrome", name: "Chrome", data: [66] },
        { id: "safari", name: "Safari", data: [14] },
        { id: "firefox", name: "Firefox", data: [5] },
        { id: "uc ", name: "UC Browser", data: [4] },
        { id: "opera", name: "Opera", data: [3] },
        { id: "other", name: "Other", data: [5] },
    ];
}
