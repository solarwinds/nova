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
    selector: "donut-gauge-with-thresholds-example",
    templateUrl: "./donut-gauge-with-thresholds.example.component.html",
    styleUrls: ["./donut-gauge-with-thresholds.example.component.less"],
})
export class DonutGaugeWithThresholdsExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;
    public value = 178;
    public reversed = false;

    private thresholds: IGaugeThresholdsConfig;
    private seriesSet: IChartAssistSeries<IAccessors>[];

    private lowThreshold = 100;
    private highThreshold = 158;

    public ngOnInit(): void {
        // Generating a standard set of thresholds with warning and critical levels
        this.thresholds = GaugeUtil.createStandardThresholdsConfig(this.lowThreshold, this.highThreshold);

        /**
         * Optionally, instead of using the 'createStandardThresholdsConfig' function as above, you can manually create a thresholds
         * config object like the following with as many or as few threshold definitions as you need.
         */
        // this.thresholds = {
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
        this.seriesSet = GaugeUtil.update(this.seriesSet, this.gaugeConfig);
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
