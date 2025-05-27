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

import { Component, OnInit, ViewChild } from "@angular/core";

import {
    Chart,
    ChartComponent,
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-base-grid-auto-margins-example",
    templateUrl: "./base-grid-auto-margins.example.component.html",
})
export class BaseGridAutoMarginsExampleComponent implements OnInit {
    public chart: Chart;

    @ViewChild(ChartComponent) chartComponent: ChartComponent;

    public ngOnInit(): void {
        const gridConfig = new XYGridConfig();
        gridConfig.axis.bottom.fit = false;
        gridConfig.axis.left.fit = false;

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

    public toggleFit(): void {
        const gridConfig = this.chart.getGrid().config() as XYGridConfig;
        gridConfig.axis.bottom.fit = !gridConfig.axis.bottom.fit;
        gridConfig.axis.left.fit = !gridConfig.axis.left.fit;
        if (!gridConfig.axis.bottom.fit) {
            gridConfig.dimension.margin = Object.assign(
                {},
                XYGridConfig.DEFAULT_MARGIN
            );
        }
        this.chart.updateDimensions();
        this.chartComponent.redraw();
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: 100, y: 10000 },
                { x: 200, y: 30000 },
                { x: 300, y: 5000 },
                { x: 400, y: 20000 },
                { x: 500, y: 15000 },
            ],
        },
    ];
}
