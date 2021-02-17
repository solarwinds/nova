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
        { value: 112 },
        { value: 125 },
        { value: 150 },
        { value: 187 },
        { value: 200 },
    ];

    constructor() {
        // this.thresholds = new Array(200).fill(null).map((e, i) => ({ value: i }));
        // this.thresholds = [{ value: 187 }/* , { value: 50 }, { value: 75 },
        // { value: 100 }, { value: 125 }, { value: 150 }, { value: 175 }, { value: 200 } */];
    }
}
