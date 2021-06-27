import { Component, OnInit } from "@angular/core";
import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
} from "@nova-ui/charts";

@Component({
    selector: "horizontal-gauge-with-thresholds-example",
    templateUrl: "./horizontal-gauge-with-thresholds-example.component.html",
    styleUrls: ["./horizontal-gauge-with-thresholds-example.component.less"],
})
export class HorizontalGaugeWithThresholdsExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;
    public value = 89;

    private thresholds: IGaugeThresholdsConfig;
    private seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit(): void {
        // Generating a standard set of thresholds with warning and critical levels
        this.thresholds = GaugeUtil.createStandardThresholdsConfig(50, 79);

        /**
         * Optionally, instead of using the 'createStandardThresholdsConfig' function as above, you can manually create a thresholds
         * config object like the following with as many or as few threshold definitions as you need.
         */
        // this.thresholds = {
        //     definitions: {
        //         [StandardGaugeThresholdId.Warning]: {
        //             id: StandardGaugeThresholdId.Warning,
        //             value: 50,
        //             enabled: true,
        //             color: StandardGaugeColor.Warning,
        //         },
        //         [StandardGaugeThresholdId.Critical]: {
        //             id: StandardGaugeThresholdId.Critical,
        //             value: 79,
        //             enabled: true,
        //             color: StandardGaugeColor.Critical,
        //         },
        //     },
        //     reversed: false,
        //     disableMarkers: false,
        //     markerRadius: StandardGaugeThresholdMarkerRadius.Large,
        // };

        this.gaugeConfig = this.getGaugeConfig();
        this.chartAssist = GaugeUtil.createChartAssist(this.gaugeConfig, GaugeMode.Horizontal);
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
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
            max: 100,

            // Enabling the thresholds
            thresholds: this.thresholds,
        };
    }
}
