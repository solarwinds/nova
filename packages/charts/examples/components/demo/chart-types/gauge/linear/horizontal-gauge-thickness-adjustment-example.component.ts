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
    StandardLinearGaugeThickness,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "horizontal-gauge-thickness-adjustment-example",
    templateUrl: "./horizontal-gauge-thickness-adjustment-example.component.html",
    styleUrls: ["./horizontal-gauge-thickness-adjustment-example.component.less"],
})
export class HorizontalGaugeThicknessAdjustmentExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;
    public value = 64;
    public compact = true;
    public labelsPlugin = new LinearGaugeLabelsPlugin();

    private seriesSet: IChartAssistSeries<IAccessors>[];
    private thresholds: IGaugeThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(50, 79);

    public ngOnInit(): void {
        // Disabling the threshold markers and labels for a more minimalistic appearance in compact mode
        this.thresholds.disableMarkers = this.compact;
        this.labelsPlugin.config.disableThresholdLabels = this.compact;

        // Setting the optional thickness parameter on the linearGaugeGridConfig function (default is StandardLinearGaugeThickness.Large)
        const thickness = this.compact ? StandardLinearGaugeThickness.Medium : StandardLinearGaugeThickness.Large;
        const gridConfig: XYGridConfig = linearGaugeGridConfig(GaugeMode.Horizontal, thickness) as XYGridConfig;
        const grid = new XYGrid(gridConfig);

        this.chartAssist = new ChartAssist(new Chart(grid), stack);
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.gaugeConfig = this.getGaugeConfig();
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauge();
    }

    public onCompactChange(compact: boolean): void {
        this.compact = compact;

        // Disabling/enabling the threshold markers and labels
        this.thresholds.disableMarkers = this.compact;
        this.labelsPlugin.config.disableThresholdLabels = this.compact;
        this.updateGauge();

        // Updating the thickness
        this.updateThickness();
    }

    private updateThickness() {
        // Using standard thicknesses based on whether the gauge is in compact mode
        const thickness = this.compact ? StandardLinearGaugeThickness.Medium : StandardLinearGaugeThickness.Large;

        // Updating the chart's height with the desired gauge thickness in pixels
        const gridConfig = this.chartAssist.chart.getGrid().config();
        gridConfig.dimension.height(thickness);
        this.chartAssist.chart.updateDimensions();
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
