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
import cloneDeep from "lodash/cloneDeep";

import {
    GaugeUtil,
    IGaugeConfig,
    GaugeThresholdDefs,
    StandardGaugeThresholdId,
} from "@nova-ui/charts";

@Component({
    selector: "gauge-visual-test",
    templateUrl: "./gauge-visual-test.component.html",
})
export class GaugeVisualTestComponent {
    public warningEnabled = true;
    public gaugeConfigs = [
        this.getGaugeConfig(42),
        this.getGaugeConfig(130),
        this.getGaugeConfig(178),
    ];

    public getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 200,
            thresholds: GaugeUtil.createStandardThresholdsConfig(100, 158),
        };
    }

    public onWarningEnabledChange(enabled: boolean): void {
        this.warningEnabled = enabled;
        this.gaugeConfigs = this.gaugeConfigs.map((c) => {
            const config = cloneDeep(c);
            (config.thresholds?.definitions as GaugeThresholdDefs)[
                StandardGaugeThresholdId.Warning
            ].enabled = this.warningEnabled;
            return config;
        });
    }
}
