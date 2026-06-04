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
import { FormControl } from "@angular/forms";

import { IProportionalDataItem } from "@nova-ui/dashboards";

type ProportionalChartType = "donut" | "pie" | "verticalBar" | "horizontalBar";
type LegendPlacement = "right" | "bottom" | "none";

/**
 * Proportional Chart View - Playground example.
 * Lets you switch between all supported chart types and legend placements
 * to see every visual variant the standalone view component provides.
 */
@Component({
    selector: "proportional-chart-view-playground-example",
    templateUrl: "./proportional-chart-view-playground-example.component.html",
    standalone: false,
})
export class ProportionalChartViewPlaygroundExampleComponent {
    public readonly chartTypeControl = new FormControl<ProportionalChartType>(
        "donut",
        { nonNullable: true }
    );
    public readonly legendPlacementControl = new FormControl<LegendPlacement>(
        "right",
        { nonNullable: true }
    );

    public readonly chartTypeOptions: ProportionalChartType[] = [
        "donut",
        "pie",
        "verticalBar",
        "horizontalBar",
    ];
    public readonly legendPlacementOptions: LegendPlacement[] = [
        "right",
        "bottom",
        "none",
    ];

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
