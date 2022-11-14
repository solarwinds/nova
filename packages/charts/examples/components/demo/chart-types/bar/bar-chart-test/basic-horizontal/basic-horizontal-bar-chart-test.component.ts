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

import { AfterViewInit, Component } from "@angular/core";

import {
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    Chart,
    IBarAccessors,
    IBarChartConfig,
    IChartSeries,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-basic-horizontal-bar-chart-test",
    templateUrl: "./basic-horizontal-bar-chart-test.component.html",
})
export class BasicHorizontalBarChartTestComponent implements AfterViewInit {
    public config: IBarChartConfig = { horizontal: true };
    public chart = new Chart(barGrid(this.config));

    constructor() {
        const gridConfig = this.chart.getGrid().config() as XYGridConfig;
        gridConfig.axis.left.fit = false;
        gridConfig.dimension.margin.left = 150;
    }

    public ngAfterViewInit(): void {
        const accessors = barAccessors(this.config);
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("y"),
        });

        const scales = barScales(this.config);

        const seriesSet: IChartSeries<IBarAccessors>[] = getData().map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chart.update(seriesSet);
    }
}

function getData() {
    return [
        { id: "series-1", name: "Long Name Test Long Name Test", data: [20] },
        { id: "series-2", name: "Results", data: [80] },
    ];
}
