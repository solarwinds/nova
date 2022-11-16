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
    radial,
    RadialAccessors,
    radialGrid,
    RadialRenderer,
    radialScales,
} from "@nova-ui/charts";

@Component({
    selector: "nui-donut-chart-example",
    templateUrl: "./donut-chart.example.component.html",
})
export class DonutChartExampleComponent implements OnInit {
    public chartAssist: ChartAssist;

    public ngOnInit(): void {
        // Create a Chart instance using the result of the radialGrid configuration function as the constructor argument
        const chart = new Chart(radialGrid());

        // Create a ChartAssist instance passing the chart and the radial series processor as constructor arguments
        this.chartAssist = new ChartAssist(chart, radial);

        // Generate radial accessors, scales, and renderer to be included in the IChartAssistSeries collection
        const accessors = new RadialAccessors();
        const scales = radialScales();
        const renderer = new RadialRenderer();

        // Invoke the chart assist's update method with the IChartAssistSeries collection as the argument
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
        { id: "chrome", name: "Chrome", data: [80] },
        { id: "edge", name: "Edge", data: [20] },
    ];
}
