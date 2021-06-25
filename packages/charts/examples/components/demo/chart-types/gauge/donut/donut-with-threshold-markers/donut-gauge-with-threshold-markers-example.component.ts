import { Component, OnInit } from "@angular/core";
import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
    StandardGaugeThresholdId,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-with-threshold-markers-example",
    templateUrl: "./donut-gauge-with-threshold-markers-example.component.html",
    styleUrls: ["./donut-gauge-with-threshold-markers-example.component.less"],
})
export class DonutGaugeWithThresholdMarkersExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;
    public value = 178;
    public reversed = false;

    private seriesSet: IChartAssistSeries<IAccessors>[];

    private lowThreshold = 100;
    private highThreshold = 158;

    // Generating a standard set of thresholds with warning and critical levels
    private thresholds: IGaugeThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(this.lowThreshold, this.highThreshold);

    /**
     * Optionally, instead of using the 'createStandardThresholdsConfig' function as above, you can manually create a thresholds
     * config object like the following with as many or as few thresholds as you need.
     */
    // private thresholds: IGaugeThresholdsConfig = {
    //     definitions: {
    //         [StandardGaugeThresholdId.Warning]: {
    //             id: StandardGaugeThresholdId.Warning,
    //             value: this.lowThreshold,
    //             enabled: true,
    //             color: StandardGaugeColor.Warning,
    //         },
    //         [StandardGaugeThresholdId.Critical]: {
    //             id: StandardGaugeThresholdId.Critical,
    //             value: this.highThreshold,
    //             enabled: true,
    //             color: StandardGaugeColor.Critical,
    //         },
    //     },
    //     reversed: false,
    //     disableMarkers: false,
    //     markerRadius: StandardGaugeThresholdMarkerRadius.Large,
    // };

    public ngOnInit(): void {
        this.gaugeConfig = this.getGaugeConfig();
        this.chartAssist = GaugeUtil.createChartAssist(this.gaugeConfig, GaugeMode.Donut);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauge();
    }

    public onReversedChange(reversed: boolean): void {
        this.reversed = reversed;
        this.thresholds.reversed = reversed;

        // swap the values of the warning and critical thresholds
        this.thresholds.definitions[StandardGaugeThresholdId.Warning].value = this.reversed ? this.highThreshold : this.lowThreshold;
        this.thresholds.definitions[StandardGaugeThresholdId.Critical].value = this.reversed ? this.lowThreshold : this.highThreshold;

        this.updateGauge();
    }

    private updateGauge() {
        this.gaugeConfig = this.getGaugeConfig();
        this.seriesSet = GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig);
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(): IGaugeConfig {
        return {
            value: this.value,
            max: 200,

            // Enabling the thresholds
            thresholds: this.thresholds,
        };
    }
}
