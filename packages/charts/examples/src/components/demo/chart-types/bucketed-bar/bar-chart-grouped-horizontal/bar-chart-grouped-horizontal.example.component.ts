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
    BarTooltipsPlugin,
    Chart,
    ChartAssist,
    IBarChartConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-grouped-horizontal-example",
    templateUrl: "./bar-chart-grouped-horizontal.example.component.html",
})
export class BarChartGroupedHorizontalExampleComponent implements OnInit {
    public chartAssist: ChartAssist;

    // The configuration to be used with plugins and convenience functions
    public barConfig: IBarChartConfig = { horizontal: true, grouped: true };
    public tooltipsPlugin = new BarTooltipsPlugin(this.barConfig);

    public ngOnInit(): void {
        const chart = new Chart(barGrid(this.barConfig));
        this.chartAssist = new ChartAssist(chart);

        chart.addPlugin(this.tooltipsPlugin);

        const accessors = barAccessors(this.barConfig);
        // Both category and sub-category need to be defined to properly draw groups.
        accessors.data.category = (data, i, series, dataSeries) => [
            data.name,
            dataSeries.name,
        ];

        // BarHighlightStrategy should be applied to a different axis in case of horizontal layout
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("y"),
        });

        // Nested BandScales with a LinearScale for values can be instantiated with the barAccessors function
        const scales = barScales(this.barConfig);

        this.chartAssist.update(
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
        {
            id: "Brno",
            name: "Brno",
            data: [
                { name: "Q1 2018", value: 167 },
                { name: "Q2 2018", value: 122 },
                { name: "Q3 2018", value: 141 },
                { name: "Q4 2018", value: 66 },
            ],
        },
        {
            id: "Austin",
            name: "Austin",
            data: [
                { name: "Q1 2018", value: 167 },
                { name: "Q2 2018", value: 198 },
                { name: "Q3 2018", value: 208 },
                { name: "Q4 2018", value: 233 },
            ],
        },
        {
            id: "Edinburgh",
            name: "Edinburgh",
            data: [
                { name: "Q1 2018", value: 167 },
                // sparse data is handled as well
                // { "name": "Q2 2018", "value": 15 },
                { name: "Q3 2018", value: 208 },
                { name: "Q4 2018", value: 123 },
            ],
        },
        {
            id: "Newcastle",
            name: "Newcastle",
            data: [
                { name: "Q1 2018", value: 11 },
                { name: "Q2 2018", value: 99 },
                { name: "Q3 2018", value: 17 },
                { name: "Q4 2018", value: 25 },
            ],
        },
        {
            id: "Kyiv",
            name: "Kyiv",
            data: [
                { name: "Q1 2018", value: 121 },
                { name: "Q2 2018", value: 222 },
                { name: "Q3 2018", value: 319 },
                { name: "Q4 2018", value: 328 },
            ],
        },
    ];
}
