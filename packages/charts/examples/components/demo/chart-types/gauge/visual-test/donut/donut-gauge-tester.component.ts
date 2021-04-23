import { Component, Input, OnInit } from "@angular/core";
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
    radialGrid
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-tester",
    templateUrl: "./donut-gauge-tester.component.html",
    styleUrls: ["./donut-gauge-tester.component.less"],
})
export class DonutGaugeTesterComponent implements OnInit {
    @Input() public gaugeConfig: IGaugeConfig;
    @Input() public size = 250;

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit() {
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin());

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);
        this.chartAssist.update(this.seriesSet);
    }
}
