import { Component } from "@angular/core";
import { GaugeUtil, IGaugeConfig, IGaugeThresholdConfigs, StandardGaugeThresholdId } from "@nova-ui/charts";
import cloneDeep from "lodash/cloneDeep"

@Component({
    selector: "gauge-visual-test",
    templateUrl: "./gauge-visual-test.component.html",
})
export class GaugeVisualTestComponent {
    public warningEnabled = true;
    public gaugeConfigs = [this.getGaugeConfig(42), this.getGaugeConfig(130), this.getGaugeConfig(178)];

    public getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 200,
            thresholds: GaugeUtil.createStandardThresholdConfigs(100, 158),
        };
    }

    public onWarningEnabledChange(enabled: boolean): void {
        this.warningEnabled = enabled;
        this.gaugeConfigs = this.gaugeConfigs.map(c => {
            const config = cloneDeep(c);
            (config.thresholds as IGaugeThresholdConfigs)[StandardGaugeThresholdId.Warning].enabled = this.warningEnabled;
            return config;
        });
    }
}
