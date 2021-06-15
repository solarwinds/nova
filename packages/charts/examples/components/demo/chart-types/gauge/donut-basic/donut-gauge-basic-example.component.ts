import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    radial,
    radialGrid,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-basic-example",
    templateUrl: "./donut-gauge-basic-example.component.html",
    styleUrls: ["./donut-gauge-basic-example.component.less"],
})
export class DonutGaugeBasicExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;

    private seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit(): void {
        // Setting up the gauge config
        const initialValue = 128;
        this.gaugeConfig = this.getGaugeConfig(initialValue);

        // Creating the chart
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

        // Assembling the series
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);

        // Updating the chart
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        // Updating the gauge config
        this.gaugeConfig = this.getGaugeConfig(value);

        // Updating the series set with the new config
        this.seriesSet = GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig);

        // Updating the chart with the updated series set
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 200,
        };
    }
}
