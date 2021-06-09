import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    linearGaugeGridConfig,
    LinearGaugeLabelsPlugin,
    stack,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "horizontal-gauge-tester",
    templateUrl: "./horizontal-gauge-tester.component.html",
    styleUrls: ["./horizontal-gauge-tester.component.less"],
})
export class HorizontalGaugeTesterComponent implements OnInit, OnChanges {
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<HorizontalGaugeTesterComponent>): void {
        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Horizontal) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);
        this.chartAssist.chart.addPlugin(new LinearGaugeLabelsPlugin());

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }
}
