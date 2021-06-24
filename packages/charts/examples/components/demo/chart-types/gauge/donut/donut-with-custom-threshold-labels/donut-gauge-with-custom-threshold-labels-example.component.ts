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
    selector: "donut-gauge-with-custom-threshold-labels-example",
    templateUrl: "./donut-gauge-with-custom-threshold-labels-example.component.html",
    styleUrls: ["./donut-gauge-with-custom-threshold-labels-example.component.less"],
})
export class DonutGaugeWithCustomThresholdLabelsExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;

    private seriesSet: IChartAssistSeries<IAccessors>[];
    private thresholds: IGaugeThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(50, 80);

    public ngOnInit(): void {
        const initialValue = 40;
        this.gaugeConfig = this.getGaugeConfig(initialValue);
        this.chartAssist = GaugeUtil.createChartAssist(GaugeMode.Donut);

        // Adding the labels plugin
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin());

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.gaugeConfig = this.getGaugeConfig(value);
        this.seriesSet = GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig);
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 100,
            thresholds: this.thresholds,

            // Setting a custom label formatter
            labelFormatter: (d: string) => `${d}%`,
        };
    }
}
