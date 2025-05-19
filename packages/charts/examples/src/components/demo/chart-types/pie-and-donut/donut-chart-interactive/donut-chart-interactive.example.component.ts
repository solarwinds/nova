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
import zipObject from "lodash/zipObject";

import {
    Chart,
    ChartAssist,
    CHART_PALETTE_CS_S_EXTENDED,
    MappedValueProvider,
    radial,
    RadialAccessors,
    radialGrid,
    RadialRenderer,
    radialScales,
} from "@nova-ui/charts";

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
    Down = "down",
    Unmanaged = "unmanaged",
    Unknown = "unknown",
}

@Component({
    selector: "nui-donut-chart-interactive-example",
    templateUrl: "./donut-chart-interactive.example.component.html",
})
export class DonutChartInteractiveExampleComponent implements OnInit {
    public chartAssist: ChartAssist;

    public ngOnInit(): void {
        // Instantiate the chart and chart assist
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

        // If custom colors are needed, instantiate a custom color provider in the form of a MappedValueProvider.
        // This is only needed if your chart requires colors that deviate from the ones provided by the default
        // color provider.
        const statusColorProvider = new MappedValueProvider<string>(
            zipObject(
                [
                    Status.Down,
                    Status.Critical,
                    Status.Warning,
                    Status.Unknown,
                    Status.Up,
                    Status.Unmanaged,
                ],
                CHART_PALETTE_CS_S_EXTENDED.filter(
                    (_, index) => index % 2 === 0
                )
            )
        );

        // Instantiate the RadialAccessors and set the series color accessor to the new
        // color provider's get method
        const accessors = new RadialAccessors();
        accessors.series.color = statusColorProvider.get;

        // Create radial scales and a renderer to be included in the IChartAssistSeries collection
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
        { status: Status.Up, value: 42 },
        { status: Status.Warning, value: 14 },
        { status: Status.Critical, value: 8 },
        { status: Status.Down, value: 7 },
        { status: Status.Unmanaged, value: 5 },
        { status: Status.Unknown, value: 3 },
    ].map((d) => ({ id: d.status, name: d.status, data: [d.value] }));
}
