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
    BandScale,
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    Chart,
    ChartAssist,
    InteractionLabelPlugin,
    INTERACTION_DATA_POINTS_EVENT,
    LinearScale,
    Scales,
    SELECT_DATA_POINT_EVENT,
} from "@nova-ui/charts";

@Component({
    selector: "nui-grouped-vertical-bar-chart-test",
    templateUrl: "./grouped-vertical-bar-chart-test.component.html",
})
export class GroupedVerticalBarChartTestComponent implements OnInit {
    public chartAssist: ChartAssist;
    public accessors = barAccessors();

    public ngOnInit(): void {
        const chart = new Chart(barGrid());

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(new InteractionLabelPlugin());

        const bandScale = new BandScale();
        bandScale.padding(0.25);
        bandScale.innerScale = new BandScale();

        const linearScale = new LinearScale();
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });

        this.accessors.data.category = (data: any) => [
            data.name,
            data.subCategory,
        ];

        this.chartAssist = new ChartAssist(chart);

        const scales: Scales = {
            x: bandScale,
            y: linearScale,
        };

        const mappedSeries = getData().map((d) => ({
            ...d,
            accessors: this.accessors,
            renderer,
            scales,
        }));

        // Sample events that can be used in order to handle click or highlighting of certain status
        chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            .subscribe(console.log);
        chart
            .getEventBus()
            .getStream(SELECT_DATA_POINT_EVENT)
            .subscribe(console.log);

        this.chartAssist.update(mappedSeries);
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
                    subCategory: "Brno",
                    value: 167,
                },
                {
                    name: "Q2 2018",
                    subCategory: "Brno",
                    value: 122,
                },
                {
                    name: "Q3 2018",
                    subCategory: "Brno",
                    value: 141,
                },
                {
                    name: "Q4 2018",
                    subCategory: "Brno",
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
                    subCategory: "Austin",
                    value: 167,
                },
                {
                    name: "Q2 2018",
                    subCategory: "Austin",
                    value: 198,
                },
                {
                    name: "Q3 2018",
                    subCategory: "Austin",
                    value: 208,
                },
                {
                    name: "Q4 2018",
                    subCategory: "Austin",
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
                    subCategory: "Edinburgh",
                    value: 167,
                },
                // sparse data is handled as well
                // {
                //     "name": "Q2 2018",
                //     "subCategory": "Edinburgh",
                //     "value": 15,
                // },
                {
                    name: "Q3 2018",
                    subCategory: "Edinburgh",
                    value: 208,
                },
                {
                    name: "Q4 2018",
                    subCategory: "Edinburgh",
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
                    subCategory: "Newcastle",
                    value: 11,
                },
                {
                    name: "Q2 2018",
                    subCategory: "Newcastle",
                    value: 99,
                },
                {
                    name: "Q3 2018",
                    subCategory: "Newcastle",
                    value: 17,
                },
                {
                    name: "Q4 2018",
                    subCategory: "Newcastle",
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
                    subCategory: "Kyiv",
                    value: 121,
                },
                {
                    name: "Q2 2018",
                    subCategory: "Kyiv",
                    value: 222,
                },
                {
                    name: "Q3 2018",
                    subCategory: "Kyiv",
                    value: 319,
                },
                {
                    name: "Q4 2018",
                    subCategory: "Kyiv",
                    value: 328,
                },
            ],
        },
    ];
}
