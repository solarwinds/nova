import { Component } from "@angular/core";
import {
    DataAccessor,
    DEFAULT_RADIAL_RENDERER_CONFIG,
    GaugeUtil,
    IGaugeConfig,
    IGaugeThresholdConfig,
    IGaugeThresholdConfigs,
    StandardGaugeColor,
    StandardGaugeThresholdId,
    StandardLinearGaugeThickness,
} from "@nova-ui/charts";

@Component({
    selector: "gauge-test-page",
    templateUrl: "./gauge-test-page.component.html",
    styleUrls: ["./gauge-test-page.component.less"],
})
export class GaugeTestPageComponent {
    public value = 950;
    public maxValue = 2000;
    public annularGrowth = DEFAULT_RADIAL_RENDERER_CONFIG.annularGrowth;
    public thickness = StandardLinearGaugeThickness.Large;
    public donutSize = 200;
    public thresholds: IGaugeThresholdConfigs = {
        [StandardGaugeThresholdId.Warning]: {
            id: StandardGaugeThresholdId.Warning,
            bottom: 1000,
            top: 1500,
            enabled: true,
            color: StandardGaugeColor.Warning,
        },
        [StandardGaugeThresholdId.Critical]: {
            id: StandardGaugeThresholdId.Critical,
            bottom: 1500,
            top: this.maxValue,
            enabled: true,
            color: StandardGaugeColor.Critical,
        },
    };

    public reversed = false;
    public flipLabels = false;
    public gaugeConfig: IGaugeConfig;

    private reversedColorAccessor: DataAccessor<any, any> | undefined;

    constructor() {
        // this.thresholds = new Array(200).fill(null).map((e, i) => i);
        // this.thresholds = [50, 75, 100, 125, 150, 175, 200];
        this.reversedColorAccessor = GaugeUtil.createReversedQuantityThresholdColorAccessor(this.thresholds);

        this.gaugeConfig = this.getGaugeConfig();
    }

    public onReverseChange(reversed: boolean): void {
        this.reversed = reversed;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.gaugeConfig = this.getGaugeConfig();
    }

    private getGaugeConfig(): IGaugeConfig {
        return {
            value: this.value,
            max: this.maxValue,
            reversedThresholds: this.reversed,
            thresholds: this.thresholds,
            enableThresholdMarkers: true,
        };
    }
}
