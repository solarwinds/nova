import { Component, OnInit } from "@angular/core";

import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
} from "@nova-ui/charts";

@Component({
    selector: "vertical-gauge-basic-example",
    templateUrl: "./vertical-gauge-basic.example.component.html",
    styleUrls: ["./vertical-gauge-basic.example.component.less"],
})
export class VerticalGaugeBasicExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;

    private seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit(): void {
        // Setting up the gauge config
        const initialValue = 64;
        this.gaugeConfig = this.getGaugeConfig(initialValue);

        // Creating the chart assist
        this.chartAssist = GaugeUtil.createChartAssist(
            this.gaugeConfig,
            GaugeMode.Vertical
        );

        // Assembling the series
        this.seriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Vertical
        );

        // Updating the chart
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        // Updating the gauge config
        this.gaugeConfig = this.getGaugeConfig(value);

        // Updating the series set with the new config
        this.seriesSet = GaugeUtil.update(this.seriesSet, this.gaugeConfig);

        // Updating the chart with the updated series set
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 100,

            /**
             * Optionally customize the default quantity color (defaults to StandardGaugeColor.Ok)
             */

            // defaultQuantityColor: "var(--nui-color-semantic-ok)",
        };
    }
}
