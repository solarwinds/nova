import { Component } from "@angular/core";
import { GAUGE_THICKNESS_DEFAULT, IGaugeThreshold } from "@nova-ui/charts";

@Component({
    selector: "gauge-test-page",
    templateUrl: "./gauge-test-page.component.html",
})
export class GaugeTestPageComponent {
    public value = 95;
    public maxValue = 200;
    public thickness = GAUGE_THICKNESS_DEFAULT;
    public thresholds: IGaugeThreshold[] = [
        { value: 100 },
        { value: 158 },
    ];
}
