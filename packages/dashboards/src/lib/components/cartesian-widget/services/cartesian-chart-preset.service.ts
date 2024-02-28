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

import { Component, Injectable } from "@angular/core";

import { StatusBarChartComponent } from "../chart-presets/status-bar-chart/status-bar-chart.component";
import { LineChartComponent } from "../chart-presets/xy-chart/chart-types/line-chart.component";
import { StackedAreaChartComponent } from "../chart-presets/xy-chart/chart-types/stacked-area-chart.component";
import { StackedBarChartComponent } from "../chart-presets/xy-chart/chart-types/stacked-bar-chart.component";
import { StackedPercentageAreaChartComponent } from "../chart-presets/xy-chart/chart-types/stacked-percentage-area-chart.component";
import { CartesianChartPreset, IChartPreset } from "../types";
import {
    BarChartComponent
} from "../chart-presets/xy-chart/chart-types/bar-chart.component";

@Component({
    selector: "nui-stub",
    template: `stub component comming soon`,
})
export class StubComponent {
    public static lateLoadKey = "StubComponent";
}

@Injectable({
    providedIn: "root",
})
export class CartesianChartPresetService {
    public presets: Record<CartesianChartPreset, IChartPreset>;

    constructor() {
        this.presets = {
            [CartesianChartPreset.Line]: {
                componentType: LineChartComponent.lateLoadKey,
            },
            [CartesianChartPreset.Bar]: {
                componentType: BarChartComponent.lateLoadKey,
            },
            [CartesianChartPreset.StackedArea]: {
                componentType: StackedAreaChartComponent.lateLoadKey,
            },
            [CartesianChartPreset.StackedPercentageArea]: {
                componentType: StackedPercentageAreaChartComponent.lateLoadKey,
            },
            [CartesianChartPreset.StackedBar]: {
                componentType: StackedBarChartComponent.lateLoadKey,
            },
            [CartesianChartPreset.StatusBar]: {
                componentType: StatusBarChartComponent.lateLoadKey,
            },
        };
    }
}
