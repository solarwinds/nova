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
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-with-custom-threshold-labels-example",
    templateUrl: "./donut-gauge-with-custom-threshold-labels-example.component.html",
    styleUrls: ["./donut-gauge-with-custom-threshold-labels-example.component.less"],
})
export class DonutGaugeWithCustomThresholdLabelsExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public value = 64;
    public gaugeConfig: IGaugeConfig;

    private seriesSet: IChartAssistSeries<IAccessors>[];

    // Generating a standard set of thresholds with warning and critical levels
    private thresholds = {
        ...GaugeUtil.createStandardThresholdsConfig(50, 79),

        // Setting a custom label formatter
        labelFormatter: (d: string) => `${d}%`,
    };

    public ngOnInit(): void {
        // Setting up the gauge config
        this.gaugeConfig = this.getGaugeConfig();

        // Creating the chart
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

        // Adding the labels plugin
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin());

        // Assembling the series set
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);

        // Modify the threshold label formatter
        // this.seriesSet = GaugeUtil.setThresholdLabelFormatter((d: string) => `${d}%`, this.seriesSet);

        // Updating the chart
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;

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
            max: 100,
            thresholds: this.thresholds,
        };
    }
}
