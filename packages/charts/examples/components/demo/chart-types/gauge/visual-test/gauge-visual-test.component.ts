import { Component } from "@angular/core";
import { IGaugeConfig } from "@nova-ui/charts";

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
            thresholds: [100, 158],
            enableThresholdMarkers: true,
        };
    }
}
