import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IDataSeries,
    IGaugeConfig,
    radial,
    radialGrid,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-with-threshold-markers-example",
    templateUrl: "./donut-gauge-with-threshold-markers-example.component.html",
    styleUrls: ["./donut-gauge-with-threshold-markers-example.component.less"],
})
export class DonutGaugeWithThresholdMarkersExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;

    private seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit() {
        // Setting up the gauge config
        const initialValue = 128;
        this.gaugeConfig = this.getGaugeConfig(initialValue);

        // Creating the chart
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

        // Adding the labels plugin
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin());

        // Assembling the series set
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

            // Enabling the thresholds
            thresholds: [100, 158],

            // Enabling the threshold markers
            enableThresholdMarkers: true,

            // ** Optional color accessor override **
            // quantityColorAccessor: (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            //     if (this.gaugeConfig?.thresholds && this.gaugeConfig.thresholds[1] <= data.value) {
            //         return "purple";
            //     }
            //     if (this.gaugeConfig?.thresholds && this.gaugeConfig.thresholds[0] <= data.value) {
            //         return "pink";
            //     }
            //     return "green";
            // },
        };
    }
}
