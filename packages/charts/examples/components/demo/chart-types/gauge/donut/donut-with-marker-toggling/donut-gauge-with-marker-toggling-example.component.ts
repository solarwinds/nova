import { Component, OnInit } from "@angular/core";
import {
    ChartAssist,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-with-marker-toggling-example",
    templateUrl: "./donut-gauge-with-marker-toggling-example.component.html",
    styleUrls: ["./donut-gauge-with-marker-toggling-example.component.less"],
})
export class DonutGaugeWithMarkerTogglingExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public value = 128;
    public gaugeConfig: IGaugeConfig;
    public markersEnabled = true;
    public labelsPlugin = new DonutGaugeLabelsPlugin();

    private seriesSet: IChartAssistSeries<IAccessors>[];

    // Generating a standard set of thresholds with warning and critical levels
    private thresholds: IGaugeThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(100, 158);

    public ngOnInit(): void {
        this.gaugeConfig = this.getGaugeConfig();
        this.chartAssist = GaugeUtil.createChartAssist(GaugeMode.Donut);

        // Adding the labels plugin
        // Note: This plugin can be completely omitted if labels aren't needed for your use case.
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);
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
            max: 200,
            thresholds: this.thresholds,
        };
    }
}
