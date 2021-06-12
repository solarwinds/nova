import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    radial,
    radialGrid,
    StandardGaugeThresholdId,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-with-threshold-toggling-example",
    templateUrl: "./donut-gauge-with-threshold-toggling-example.component.html",
    styleUrls: ["./donut-gauge-with-threshold-toggling-example.component.less"],
})
export class DonutGaugeWithThresholdTogglingExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public value = 128;
    public gaugeConfig: IGaugeConfig;
    public warningEnabled = true;
    public criticalEnabled = true;

    private seriesSet: IChartAssistSeries<IAccessors>[];

    // Generating a standard set of thresholds with warning and critical levels
    private thresholds = GaugeUtil.createStandardThresholdsConfig(100, 158);

    public ngOnInit(): void {
        // Setting up the gauge config
        this.gaugeConfig = this.getGaugeConfig();

        // Creating the chart
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

        // Adding the labels plugin
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin());

        // Assembling the series set
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);

        // Updating the chart
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;

        this.updateGauge();
    }

    public onWarningEnabledChange(enabled: boolean): void {
        this.warningEnabled = enabled;

        // Enabling or disabling the threshold individually
        this.thresholds.definitions[StandardGaugeThresholdId.Warning].enabled = this.warningEnabled;

        this.updateGauge();
    }

    public onCriticalEnabledChange(enabled: boolean): void {
        this.criticalEnabled = enabled;

        // Enabling or disabling the threshold individually
        this.thresholds.definitions[StandardGaugeThresholdId.Critical].enabled = this.criticalEnabled;

        this.updateGauge();
    }

    private updateGauge() {
        // Updating the gauge config
        this.gaugeConfig = this.getGaugeConfig();

        // Updating the series set with the new config
        this.seriesSet = GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig);

        // Updating the chart with the updated series set
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
