import { Component } from "@angular/core";
import { DataAccessor, DEFAULT_RADIAL_RENDERER_CONFIG, GaugeUtil, IGaugeConfig, StandardLinearGaugeThickness } from "@nova-ui/charts";

@Component({
    selector: "gauge-test-page",
    templateUrl: "./gauge-test-page.component.html",
    styleUrls: ["./gauge-test-page.component.less"],
})
export class GaugeTestPageComponent {
    public value = 95;
    public maxValue = 200;
    public annularGrowth = DEFAULT_RADIAL_RENDERER_CONFIG.annularGrowth;
    public thickness = StandardLinearGaugeThickness.Large;
    public donutSize = 200;
    public thresholds: number[] = [100, 150];
    public reversed = false;
    public flipLabels = false;
    public gaugeConfig: IGaugeConfig;

    private reversedValueColorAccessor: DataAccessor<any, any> | undefined;

    constructor() {
        // this.thresholds = new Array(200).fill(null).map((e, i) => i);
        // this.thresholds = [50, 75, 100, 125, 150, 175, 200];
        this.reversedValueColorAccessor = GaugeUtil.createReversedColorAccessor(this.thresholds);

        this.gaugeConfig = this.getGaugeConfig();
    }

    public onReverseChange(reversed: boolean) {
        this.reversed = reversed;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onValueChange(value: number) {
        this.value = value;
        this.gaugeConfig = this.getGaugeConfig();
    }

    private getGaugeConfig(): IGaugeConfig {
        return {
            value: this.value,
            max: this.maxValue,
            thresholds: this.thresholds,
            valueColorAccessor: this.reversed ? this.reversedValueColorAccessor : undefined,
            enableThresholdMarkers: true,
        };
    }
}
