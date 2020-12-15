import { Component } from "@angular/core";
import { IGaugeThreshold } from "@nova-ui/charts";

@Component({
    selector: "gauge-visual-test",
    templateUrl: "./gauge-visual-test.component.html",
})
export class GaugeVisualTestComponent {
    public thresholds: IGaugeThreshold[] = [
        { value: 100 },
        { value: 158 },
    ];
 }
