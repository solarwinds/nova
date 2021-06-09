import { Component } from "@angular/core";
import { GaugeUtil, IGaugeConfig, StandardGaugeThresholdId } from "@nova-ui/charts";

@Component({
    selector: "gauge-visual-test",
    templateUrl: "./gauge-visual-test.component.html",
})
export class GaugeVisualTestComponent {
    public lowValue = 42;
    public mediumValue = 130;
    public highValue = 178;
    public warningEnabled = true;
    public criticalEnabled = true;

    public getGaugeConfig(value: number): IGaugeConfig {
        const gaugeConfig = {
            value,
            max: 200,
            thresholds: GaugeUtil.createStandardThresholdConfigs(100, 158),
        };

        gaugeConfig.thresholds[StandardGaugeThresholdId.Warning].enabled = this.warningEnabled;
        gaugeConfig.thresholds[StandardGaugeThresholdId.Critical].enabled = this.criticalEnabled;

        return gaugeConfig;
    }

    public onWarningEnabledChange(enabled: boolean): void {
        this.warningEnabled = enabled;
    }

    public onCriticalEnabledChange(enabled: boolean): void {
        this.criticalEnabled = enabled;
    }
}
