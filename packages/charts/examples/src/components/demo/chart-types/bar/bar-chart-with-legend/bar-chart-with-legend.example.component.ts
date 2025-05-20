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
    BarSeriesHighlightStrategy,
    Chart,
    ChartAssist,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-with-legend-example",
    templateUrl: "./bar-chart-with-legend.example.component.html",
})
export class BarChartWithLegendExampleComponent implements OnInit {
    public barConfig = { horizontal: false };

    // the usage of ChartAssist helps with connecting the chart with the legend
    public chartAssist = new ChartAssist(new Chart(barGrid(this.barConfig)));

    public ngOnInit(): void {
        const accessors = barAccessors(
            this.barConfig,
            this.chartAssist.palette.standardColors
        );
        const renderer = new BarRenderer({
            // highlightStrategy determines how the bar chart should manage highlighting.
            // BarSeriesHighlightStrategy emphasizes the entire series on hovering a single bar,
            // which also triggers emphasis on the legend tile.
            highlightStrategy: new BarSeriesHighlightStrategy(
                "x" /* "x" determines which scale the highlight should be driven by */
            ),
        });
        const scales = barScales(this.barConfig);

        // it is important to update the chart via the chartAssist so that the legend is also updated
        this.chartAssist.update(
            getData().map((s) => ({
                ...s,
                accessors,
                scales,
                renderer,
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
        { id: "uc", name: "UC Browser", data: [4] },
        { id: "opera", name: "Opera", data: [3] },
        { id: "other", name: "Other", data: [5] },
    ];
}
