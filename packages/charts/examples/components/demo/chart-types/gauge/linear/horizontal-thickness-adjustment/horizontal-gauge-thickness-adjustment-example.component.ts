import { Component, OnInit } from "@angular/core";
import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
    StandardGaugeThresholdMarkerRadius,
    StandardLinearGaugeThickness,
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

    private seriesSet: IChartAssistSeries<IAccessors>[];
    private thresholds: IGaugeThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(50, 79);

    public ngOnInit(): void {
        // Setting the initial threshold marker radius
        this.thresholds.markerRadius = this.compact ? StandardGaugeThresholdMarkerRadius.Small : StandardGaugeThresholdMarkerRadius.Large;

        this.gaugeConfig = this.getGaugeConfig();
        this.chartAssist = GaugeUtil.createChartAssist(this.gaugeConfig, GaugeMode.Horizontal);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauge();
    }

    public onCompactChange(compact: boolean): void {
        this.compact = compact;

        // Adjusting the threshold marker radius
        this.thresholds.markerRadius = this.compact ? StandardGaugeThresholdMarkerRadius.Small : StandardGaugeThresholdMarkerRadius.Large;
        this.updateGauge();

        // Updating the thickness
        this.updateThickness();
    }

    private updateThickness() {
        // Using standard thicknesses based on whether the gauge is in compact mode
        const thickness = this.compact ? StandardLinearGaugeThickness.Small : StandardLinearGaugeThickness.Large;

        // Updating the chart's height with the desired gauge thickness in pixels
        const gridConfig = this.chartAssist.chart.getGrid().config();
        gridConfig.dimension.height(thickness);
        this.chartAssist.chart.updateDimensions();
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
            thresholds: this.thresholds,

            // Setting the initial thickness based on whether the gauge is in compact mode
            // The 'createChartAssist' function uses this to configure the grid's dimensions
            linearThickness: this.compact ? StandardLinearGaugeThickness.Small : StandardLinearGaugeThickness.Large,
        };
    }
}
