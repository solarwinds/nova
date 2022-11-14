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
    IBarChartConfig,
    stack,
} from "@nova-ui/charts";

@Component({
    selector: "nui-basic-stacked-horizontal-bar-chart-test",
    templateUrl: "./basic-stacked-horizontal-bar-chart-test.component.html",
})
export class BasicStackedHorizontalBarChartTestComponent implements OnInit {
    public chartAssist: ChartAssist;

    public ngOnInit(): void {
        const config = { horizontal: true } as IBarChartConfig;

        const chart = new Chart(barGrid(config));
        this.chartAssist = new ChartAssist(chart, stack);

        const accessors = barAccessors(config);
        // This matches field in data by which chart preprocessor will gather categories to build stacks
        accessors.data.category = (data: any) => data.name;

        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("y"),
        });

        const scales = barScales(config);

        const seriesSet = getData().map((d) => ({
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
            id: "Brno",
            name: "Brno",
            data: [
                {
                    name: "Q1 2018",
                    value: 167,
                },
                {
                    name: "Q2 2018",
                    value: 122,
                },
                {
                    name: "Q3 2018",
                    value: 141,
                },
                {
                    name: "Q4 2018",
                    value: 66,
                },
            ],
        },
        {
            id: "Austin",
            name: "Austin",
            data: [
                {
                    name: "Q1 2018",
                    value: 167,
                },
                // Please note the fact that not all categories are required to be present in every data point.
                // Sparse data is ok too.
                // {
                //     "name": "Q2 2018",
                //     "value": 198,
                // },
                {
                    name: "Q3 2018",
                    value: 208,
                },
                {
                    name: "Q4 2018",
                    value: 233,
                },
            ],
        },
        {
            id: "Edinburgh",
            name: "Edinburgh",
            data: [
                {
                    name: "Q1 2018",
                    value: 167,
                },
                {
                    name: "Q2 2018",
                    value: 15,
                },
                {
                    name: "Q3 2018",
                    value: 208,
                },
                {
                    name: "Q4 2018",
                    value: 123,
                },
            ],
        },
        {
            id: "Newcastle",
            name: "Newcastle",
            data: [
                {
                    name: "Q1 2018",
                    value: 11,
                },
                {
                    name: "Q2 2018",
                    value: 99,
                },
                {
                    name: "Q3 2018",
                    value: 17,
                },
                {
                    name: "Q4 2018",
                    value: 25,
                },
            ],
        },
        {
            id: "Kyiv",
            name: "Kyiv",
            data: [
                {
                    name: "Q1 2018",
                    value: 121,
                },
                {
                    name: "Q2 2018",
                    value: 222,
                },
                {
                    name: "Q3 2018",
                    value: 319,
                },
                {
                    name: "Q4 2018",
                    value: 328,
                },
            ],
        },
    ];
}
