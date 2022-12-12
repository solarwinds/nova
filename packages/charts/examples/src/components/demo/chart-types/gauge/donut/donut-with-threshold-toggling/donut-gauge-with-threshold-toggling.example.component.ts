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
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
    StandardGaugeThresholdId,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-with-threshold-toggling-example",
    templateUrl: "./donut-gauge-with-threshold-toggling.example.component.html",
    styleUrls: ["./donut-gauge-with-threshold-toggling.example.component.less"],
})
export class DonutGaugeWithThresholdTogglingExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public value = 178;
    public gaugeConfig: IGaugeConfig;
    public warningEnabled = true;
    public criticalEnabled = true;

    private seriesSet: IChartAssistSeries<IAccessors>[];

    // Generating a standard set of thresholds with warning and critical levels
    private thresholds: IGaugeThresholdsConfig =
        GaugeUtil.createStandardThresholdsConfig(100, 158);

    public ngOnInit(): void {
        this.gaugeConfig = this.getGaugeConfig();
        this.chartAssist = GaugeUtil.createChartAssist(
            this.gaugeConfig,
            GaugeMode.Donut
        );

        this.seriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Donut
        );
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauge();
    }

    public onWarningEnabledChange(enabled: boolean): void {
        this.warningEnabled = enabled;

        // Enabling or disabling the warning threshold
        this.thresholds.definitions[StandardGaugeThresholdId.Warning].enabled =
            this.warningEnabled;

        this.updateGauge();
    }

    public onCriticalEnabledChange(enabled: boolean): void {
        this.criticalEnabled = enabled;

        // Enabling or disabling the critical threshold
        this.thresholds.definitions[StandardGaugeThresholdId.Critical].enabled =
            this.criticalEnabled;

        this.updateGauge();
    }

    private updateGauge() {
        this.gaugeConfig = this.getGaugeConfig();
        this.seriesSet = GaugeUtil.update(this.seriesSet, this.gaugeConfig);
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(): IGaugeConfig {
        return {
            value: this.value,
            max: 200,
            thresholds: this.thresholds,
        };
    }
}
