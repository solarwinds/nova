import { Component, OnInit } from "@angular/core";
import {
    ChartAssist,
    ChartDonutContentPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-with-content-example",
    templateUrl: "./donut-gauge-with-content-example.component.html",
    styleUrls: ["./donut-gauge-with-content-example.component.less"],
})
export class DonutGaugeWithContentExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public gaugeConfig: IGaugeConfig;

    private seriesSet: IChartAssistSeries<IAccessors>[];
    private thresholds: IGaugeThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(100, 158);

    public ngOnInit(): void {
        const initialValue = 128;
        this.gaugeConfig = this.getGaugeConfig(initialValue);
        this.chartAssist = GaugeUtil.createChartAssist(this.gaugeConfig, GaugeMode.Donut);

        // Adding the plugin for the donut inner content
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.gaugeConfig = this.getGaugeConfig(value);
        this.seriesSet = GaugeUtil.update(this.seriesSet, this.gaugeConfig);
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 200,
            thresholds: this.thresholds,
        };
    }
}
