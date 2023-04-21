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
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-line-chart-example",
    templateUrl: "./line-chart.example.component.html",
})
export class LineChartExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public seriesSet: IChartSeries<ILineAccessors>[];

    public ngOnInit(): void {
        this.seriesSet = [
            {
                id: "series-1",
                name: "Series 1",
                data: [
                    { x: 1, y: 10 },
                    { x: 2, y: 30 },
                    { x: 3, y: 5 },
                    { x: 4, y: 20 },
                    { x: 5, y: 15 },
                ],
                scales: {
                    x: new LinearScale(),
                    y: new LinearScale(),
                },
                renderer: new LineRenderer(),
                accessors: new LineAccessors(),
            },
        ];

        this.chart.update(this.seriesSet);
    }
}
