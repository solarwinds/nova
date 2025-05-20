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
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    Chart,
    ChartAssist,
    IBarAccessors,
    IBarChartConfig,
    IChart,
    IChartSeries,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-tick-label-max-width-test",
    templateUrl: "./bar-chart-tick-label-max-width-test.component.html",
})
export class BarChartTickLabelMaxWidthTestComponent implements OnInit {
    public chart: IChart;
    public chartAssist: ChartAssist;
    public ngOnInit(): void {
        const config: IBarChartConfig = { horizontal: true };
        const accessors = barAccessors(config);
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("y"),
        });
        const scales = barScales(config);

        this.chart = new Chart(barGrid(config));
        this.chartAssist = new ChartAssist(this.chart);

        const gridConfig = this.chart.getGrid().config() as XYGridConfig;
        gridConfig.axis.left.tickLabel.maxWidth = 100;

        const seriesSet: IChartSeries<IBarAccessors>[] = getData().map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chartAssist.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Long Name Test Long Name Test",
            data: [20],
        },
        {
            id: "series-2",
            name: "Results",
            data: [80],
        },
        {
            id: "series-3",
            name: "Supercalifragilisticexpialidocious",
            data: [45],
        },
    ];
}
