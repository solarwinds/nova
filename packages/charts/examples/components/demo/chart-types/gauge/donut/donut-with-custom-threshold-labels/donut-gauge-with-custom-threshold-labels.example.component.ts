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
    selector: "donut-gauge-with-custom-threshold-labels-example",
    templateUrl:
        "./donut-gauge-with-custom-threshold-labels.example.component.html",
    styleUrls: [
        "./donut-gauge-with-custom-threshold-labels.example.component.less",
    ],
})
export class DonutGaugeWithCustomThresholdLabelsExampleComponent
    implements OnInit
{
    public chartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;

    private seriesSet: IChartAssistSeries<IAccessors>[];
    private thresholds: IGaugeThresholdsConfig =
        GaugeUtil.createStandardThresholdsConfig(50, 75);

    public ngOnInit(): void {
        const initialValue = 40;
        this.gaugeConfig = this.getGaugeConfig(initialValue);
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
        this.gaugeConfig = this.getGaugeConfig(value);
        this.seriesSet = GaugeUtil.update(this.seriesSet, this.gaugeConfig);
        this.chartAssist.update(this.seriesSet);
    }

    private getGaugeConfig(value: number): IGaugeConfig {
        return {
            value,
            max: 100,
            thresholds: this.thresholds,

            // Setting a custom label formatter
            labels: {
                formatter: (d: string) => `${d}%`,

                /**
                 * Optionally specify a custom clearance in pixels for the labels if the
                 * display strings are too long to fit within the default grid margins.
                 */

                // clearance: 35,
            },
        };
    }
}
