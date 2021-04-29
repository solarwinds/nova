import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    radial,
    radialGrid,
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

    public ngOnInit() {
        // Setting up the gauge config
        const initialValue = 128;
        this.gaugeConfig = this.getGaugeConfig(initialValue);

        // Creating the chart
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

        // Adding the plugin for the inner content
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        // Adding the labels plugin
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin());

        // Assembling the series
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);

        // Updating the chart
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number) {
        this.gaugeConfig = this.getGaugeConfig(value);
        this.seriesSet = GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig);
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 200,
            thresholds: [100, 158],
            enableThresholdMarkers: true,
        };
    }
}
