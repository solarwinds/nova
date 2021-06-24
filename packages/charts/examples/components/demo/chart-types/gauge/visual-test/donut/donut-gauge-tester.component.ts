import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    ChartAssist,
    ChartDonutContentPlugin,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-tester",
    templateUrl: "./donut-gauge-tester.component.html",
    styleUrls: ["./donut-gauge-tester.component.less"],
})
export class DonutGaugeTesterComponent implements OnInit, OnChanges {
    @Input() public gaugeConfig: IGaugeConfig;
    @Input() public size = 250;

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<DonutGaugeTesterComponent>): void {
        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        this.chartAssist = GaugeUtil.createChartAssist(GaugeMode.Donut);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin());

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);
        this.chartAssist.update(this.seriesSet);
    }
}
