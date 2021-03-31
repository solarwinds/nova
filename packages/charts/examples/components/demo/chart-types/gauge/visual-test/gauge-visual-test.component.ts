import { Component } from "@angular/core";
import { GaugeMode, IGaugeSeriesConfig } from "@nova-ui/charts";

@Component({
    selector: "gauge-visual-test",
    templateUrl: "./gauge-visual-test.component.html",
})
export class GaugeVisualTestComponent {
    public lowValue = 42;
    public mediumValue = 130;
    public highValue = 178;

    public getSeriesConfig(value: number): IGaugeSeriesConfig {
        return {
            value,
            max: 200,
            thresholds: [100, 158],
        };
    }
 }
