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
    Chart,
    ChartAssist,
    LineAccessors,
    LineRenderer,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-legend-interactive-example",
    templateUrl: "./legend-interactive.example.component.html",
})
export class LegendInteractiveExampleComponent implements OnInit {
    // Set up the chart assist to keep track of the series selection and emphasis states
    public chartAssist: ChartAssist = new ChartAssist(new Chart(new XYGrid()));

    public firstSeriesId = "1";
    public secondSeriesId = "2";

    public ngOnInit(): void {
        const accessors = new LineAccessors();
        const renderer = new LineRenderer();
        this.chartAssist.update([
            {
                id: this.firstSeriesId,
                data: [],
                accessors,
                renderer,
                scales: {},
            },
            {
                id: this.secondSeriesId,
                data: [],
                accessors,
                renderer,
                scales: {},
            },
        ]);
    }
}
