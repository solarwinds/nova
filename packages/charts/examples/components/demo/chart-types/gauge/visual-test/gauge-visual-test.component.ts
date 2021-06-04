import { Component } from "@angular/core";
import { GaugeUtil, IGaugeConfig } from "@nova-ui/charts";

@Component({
    selector: "gauge-visual-test",
    templateUrl: "./gauge-visual-test.component.html",
})
export class GaugeVisualTestComponent {
    public lowValue = 42;
    public mediumValue = 130;
    public highValue = 178;

    public getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 200,
            thresholds: GaugeUtil.createStandardThresholdConfigs(100, 158),
        };
    }
}
