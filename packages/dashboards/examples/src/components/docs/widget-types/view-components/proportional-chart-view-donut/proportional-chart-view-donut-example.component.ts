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

import { Component } from "@angular/core";

import { IProportionalDataItem } from "@nova-ui/dashboards";

/**
 * Proportional Chart View - Donut example.
 * Demonstrates standalone usage of the proportional chart view
 * without any Pizzagna framework dependencies.
 */
@Component({
    selector: "proportional-chart-view-donut-example",
    template: `
        <div style="height: 300px; width: 100%;">
            <nui-proportional-chart-view
                [data]="chartData"
                chartType="donut"
                legendPlacement="right"
                [colors]="colors"
            ></nui-proportional-chart-view>
        </div>
    `,
    standalone: false,
})
export class ProportionalChartViewDonutExampleComponent {
    public colors: Record<string, string> = {
        down: "#dc3545",
        up: "#2cc079",
        warning: "#f3a002",
        unknown: "#707070",
    };

    public chartData: Array<IProportionalDataItem> = [
        { id: "up", name: "Up", value: 78 },
        { id: "down", name: "Down", value: 8 },
        { id: "warning", name: "Warning", value: 12 },
        { id: "unknown", name: "Unknown", value: 2 },
    ];
}
