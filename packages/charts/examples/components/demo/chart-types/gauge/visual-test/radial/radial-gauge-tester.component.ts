import { Component, Input, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeThreshold,
    radial,
    RadialGaugeLabelsPlugin,
    radialGrid
} from "@nova-ui/charts";

@Component({
    selector: "radial-gauge-tester",
    templateUrl: "./radial-gauge-tester.component.html",
    styleUrls: ["./radial-gauge-tester.component.less"],
})
export class RadialGaugeTesterComponent implements OnInit {
    @Input() public value: number;
    @Input() public max: number = 200;
    @Input() public thresholds: IGaugeThreshold[];

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit() {
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);
        this.chartAssist.chart.addPlugin(new RadialGaugeLabelsPlugin());

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.value, this.max, this.thresholds, GaugeMode.Radial);
        this.chartAssist.update(this.seriesSet);
    }
}
