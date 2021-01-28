import { Component } from "@angular/core";
import { IGaugeThreshold } from "@nova-ui/charts";

@Component({
    selector: "gauge-visual-test",
    templateUrl: "./gauge-visual-test.component.html",
})
export class GaugeVisualTestComponent {
    public lowValue = 42;
    public mediumValue = 130;
    public highValue = 178;
    public thresholds: IGaugeThreshold[] = [
        { value: 100 },
        { value: 158 },
    ];
 }
