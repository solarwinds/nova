import { Component, OnInit } from "@angular/core";

import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-without-threshold-markers-example",
    templateUrl:
        "./donut-gauge-without-threshold-markers.example.component.html",
    styleUrls: [
        "./donut-gauge-without-threshold-markers.example.component.less",
    ],
})
export class DonutGaugeWithoutThresholdMarkersExampleComponent
    implements OnInit
{
    public chartAssist: ChartAssist;
    public value = 128;
    public gaugeConfig: IGaugeConfig;

    private thresholds: IGaugeThresholdsConfig;
    private seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit(): void {
        // Generating a standard set of thresholds with warning and critical levels
        this.thresholds = GaugeUtil.createStandardThresholdsConfig(100, 158);

        // Turning off the markers
        this.thresholds.disableMarkers = true;

        this.gaugeConfig = this.getGaugeConfig();
        this.chartAssist = GaugeUtil.createChartAssist(
            this.gaugeConfig,
            GaugeMode.Donut
        );

        this.seriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Donut
        );
        this.chartAssist.update(this.seriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauge();
    }

    private updateGauge() {
        this.gaugeConfig = this.getGaugeConfig();
        this.seriesSet = GaugeUtil.update(this.seriesSet, this.gaugeConfig);
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(): IGaugeConfig {
        return {
            value: this.value,
            max: 200,
            thresholds: this.thresholds,
        };
    }
}
