import { Component } from "@angular/core";
import { DataAccessor, GaugeMode, GaugeUtil, GAUGE_THICKNESS_DEFAULT, IGaugeSeriesConfig } from "@nova-ui/charts";

@Component({
    selector: "gauge-test-page",
    templateUrl: "./gauge-test-page.component.html",
})
export class GaugeTestPageComponent {
    public value = 95;
    public maxValue = 200;
    public thickness = GAUGE_THICKNESS_DEFAULT;
    private reversedValueColorAccessor: DataAccessor<any, any> | undefined;

    public thresholds: number[] = [100, 125];

    constructor() {
        // this.thresholds = new Array(200).fill(null).map((e, i) => i);
        // this.thresholds = [187, 50, 75, 100, 125, 150, 175, 200];
        this.reversedValueColorAccessor = GaugeUtil.createReversedValueColorAccessor(this.thresholds);
    }

    public getSeriesConfig(reversed = false): IGaugeSeriesConfig {
        return {
            value: this.value,
            max: this.maxValue,
            thresholds: this.thresholds,
            valueColorAccessor: reversed ? this.reversedValueColorAccessor : undefined,
        };
    }
}
