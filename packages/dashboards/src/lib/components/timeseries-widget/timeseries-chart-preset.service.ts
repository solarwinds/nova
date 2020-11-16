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
            [TimeseriesChartPreset.Line]: { componentType: LineChartComponent.lateLoadKey },
            [TimeseriesChartPreset.StackedArea]: { componentType: StackedAreaChartComponent.lateLoadKey },
            [TimeseriesChartPreset.StackedPercentageArea]: { componentType: StackedPercentageAreaChartComponent.lateLoadKey },
            [TimeseriesChartPreset.StackedBar]: { componentType: StackedBarChartComponent.lateLoadKey },
            [TimeseriesChartPreset.StatusBar]: { componentType: StatusBarChartComponent.lateLoadKey },
        };
    }
}
