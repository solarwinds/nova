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
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-base-grid-margins-example",
    templateUrl: "./base-grid-margins.example.component.html",
})
export class BaseGridMarginsExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit(): void {
        const gridConfig = new XYGridConfig();
        gridConfig.dimension.margin = {
            top: 30,
            bottom: 30,
            left: 100,
            right: 100,
        };

        this.chart = new Chart(new XYGrid(gridConfig));
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors: new LineAccessors(),
                renderer: new LineRenderer(),
                scales: {
                    x: new LinearScale(),
                    y: new LinearScale(),
                },
            })
        );

        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [
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
        },
    ];
}
