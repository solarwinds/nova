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
    selector: "donut-gauge-with-threshold-marker-toggling-example",
    templateUrl:
        "./donut-gauge-with-threshold-marker-toggling.example.component.html",
    styleUrls: [
        "./donut-gauge-with-threshold-marker-toggling.example.component.less",
    ],
})
export class DonutGaugeWithThresholdMarkerTogglingExampleComponent
    implements OnInit
{
    public chartAssist: ChartAssist;
    public value = 128;
    public gaugeConfig: IGaugeConfig;
    public markersEnabled = true;
    public labelsPlugin = new DonutGaugeLabelsPlugin();

    private seriesSet: IChartAssistSeries<IAccessors>[];

    // Generating a standard set of thresholds with warning and critical levels
    private thresholds: IGaugeThresholdsConfig =
        GaugeUtil.createStandardThresholdsConfig(100, 158);

    public ngOnInit(): void {
        // Setting up the gauge config
        this.gaugeConfig = this.getGaugeConfig();

        // Setting up the chart assist with a local instance of the labels plugin for direct control of the label display
        this.chartAssist = GaugeUtil.createChartAssist(
            this.gaugeConfig,
            GaugeMode.Donut,
            this.labelsPlugin
        );

        // Assembling the series
        this.seriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Donut
        );

        // Updating the chart
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
        this.labelsPlugin.config.disableThresholdLabels = !this.markersEnabled;

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
            thresholds: this.thresholds,
        };
    }
}
