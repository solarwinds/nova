import { Component, OnInit } from "@angular/core";
import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
    LinearGaugeLabelsPlugin,
} from "@nova-ui/charts";

@Component({
    selector: "horizontal-gauge-with-thresholds-example",
    templateUrl: "./horizontal-gauge-with-thresholds-example.component.html",
    styleUrls: ["./horizontal-gauge-with-thresholds-example.component.less"],
})
export class HorizontalGaugeWithThresholdsExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;
    public value = 64;
    public markersEnabled = true;

    // Creating the linear gauge labels plugin
    public labelsPlugin = new LinearGaugeLabelsPlugin();

    private seriesSet: IChartAssistSeries<IAccessors>[];

    // Generating a standard set of thresholds with warning and critical levels
    private thresholds: IGaugeThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(50, 79);

    /**
     * Optionally, instead of using the 'createStandardThresholdsConfig' function as above, you can manually create a thresholds
     * config object like the following with as many or as few thresholds as you need.
     */
    // private thresholds: IGaugeThresholdsConfig = {
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
    // };

    public ngOnInit(): void {
        this.gaugeConfig = this.getGaugeConfig();
        this.chartAssist = GaugeUtil.createChartAssist(GaugeMode.Horizontal);

        // Adding the labels plugin
        // Note: This plugin can be completely omitted if labels aren't needed for your use case.
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauge();
    }

    public onMarkersEnabledChange(enabled: boolean): void {
        this.markersEnabled = enabled;

        // Enabling or disabling the threshold markers
        this.thresholds.disableMarkers = !this.markersEnabled;

        // Enabling or disabling the threshold labels
        // Note: In addition to toggling the label plugin's 'disableThresholdLabels' configuration property,
        // the plugin can simply be omitted if labels aren't needed at all for your use case.
        this.labelsPlugin.config.disableThresholdLabels = !this.markersEnabled;

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
            max: 100,
            thresholds: this.thresholds,
        };
    }
}
