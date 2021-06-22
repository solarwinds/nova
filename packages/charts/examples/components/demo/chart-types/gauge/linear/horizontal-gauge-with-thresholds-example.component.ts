import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
    linearGaugeGridConfig,
    LinearGaugeLabelsPlugin,
    stack,
    XYGrid,
    XYGridConfig,
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

    public ngOnInit(): void {
        this.gaugeConfig = this.getGaugeConfig();
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Horizontal) as XYGridConfig);
        this.chartAssist = new ChartAssist(new Chart(grid), stack);

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
