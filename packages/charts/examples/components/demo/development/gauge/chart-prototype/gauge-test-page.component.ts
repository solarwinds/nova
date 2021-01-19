import { Component } from "@angular/core";
import { IGaugeThreshold } from "@nova-ui/charts";

@Component({
    selector: "gauge-test-page",
    templateUrl: "./gauge-test-page.component.html",
})
export class GaugeTestPageComponent {
    public value = 42;
    public maxValue = 200;
    public thickness = 20;
    public thresholds: IGaugeThreshold[] = [
        { value: 100 },
        { value: 158 },
    ];
}
