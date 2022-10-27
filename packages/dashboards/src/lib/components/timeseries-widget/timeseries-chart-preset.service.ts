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

import { Injectable } from "@angular/core";

import { StatusBarChartComponent } from "./chart-presets/status-bar-chart/status-bar-chart.component";
import { LineChartComponent } from "./chart-presets/xy-chart/chart-types/line-chart.component";
import { StackedAreaChartComponent } from "./chart-presets/xy-chart/chart-types/stacked-area-chart.component";
import { StackedBarChartComponent } from "./chart-presets/xy-chart/chart-types/stacked-bar-chart.component";
import { StackedPercentageAreaChartComponent } from "./chart-presets/xy-chart/chart-types/stacked-percentage-area-chart.component";
import { IChartPreset, TimeseriesChartPreset } from "./types";

@Injectable({
    providedIn: "root",
})
export class TimeseriesChartPresetService {
    public presets: Record<TimeseriesChartPreset, IChartPreset>;

    constructor() {
        this.presets = {
            [TimeseriesChartPreset.Line]: {
                componentType: LineChartComponent.lateLoadKey,
            },
            [TimeseriesChartPreset.StackedArea]: {
                componentType: StackedAreaChartComponent.lateLoadKey,
            },
            [TimeseriesChartPreset.StackedPercentageArea]: {
                componentType: StackedPercentageAreaChartComponent.lateLoadKey,
            },
            [TimeseriesChartPreset.StackedBar]: {
                componentType: StackedBarChartComponent.lateLoadKey,
            },
            [TimeseriesChartPreset.StatusBar]: {
                componentType: StatusBarChartComponent.lateLoadKey,
            },
        };
    }
}
