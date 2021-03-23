import { Component, Input, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeSeriesConfig,
    linearGaugeGridConfig,
    stack,
    XYGrid,
    XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "horizontal-gauge-tester",
    templateUrl: "./horizontal-gauge-tester.component.html",
    styleUrls: ["./horizontal-gauge-tester.component.less"],
})
export class HorizontalGaugeTesterComponent implements OnInit {
    @Input() public seriesConfig: IGaugeSeriesConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Horizontal) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.seriesConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }
}
