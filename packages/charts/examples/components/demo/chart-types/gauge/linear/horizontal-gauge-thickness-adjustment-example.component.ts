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
    StandardGaugeThresholdMarkerRadius,
    StandardLinearGaugeThickness,
    XYGrid,
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
        // Adjusting the threshold marker radius based on the thickness
        this.thresholds.markerRadius = this.compact ? StandardGaugeThresholdMarkerRadius.Small : StandardGaugeThresholdMarkerRadius.Large;

        // Setting the optional thickness parameter on the 'linearGaugeGridConfig' function (default is StandardLinearGaugeThickness.Large)
        const thickness = this.compact ? StandardLinearGaugeThickness.Medium : StandardLinearGaugeThickness.Large;
        const gridConfig = linearGaugeGridConfig(GaugeMode.Horizontal, thickness);
        const grid = new XYGrid(gridConfig);

        // Creating the chart assist (Note the use of the stack preprocessor function. This handles the "stacking"
        // of the quantity and remainder visualizations horizontally on the gauge.)
        this.chartAssist = new ChartAssist(new Chart(grid), stack);
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        // Setting up the gauge config
        this.gaugeConfig = this.getGaugeConfig();

        // Assembling the series
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);

        // Updating the chart
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauge();
    }

    public onCompactChange(compact: boolean): void {
        this.compact = compact;

        // Adjusting the threshold marker radius based on the thickness
        this.thresholds.markerRadius = this.compact ? StandardGaugeThresholdMarkerRadius.Small : StandardGaugeThresholdMarkerRadius.Large;
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
