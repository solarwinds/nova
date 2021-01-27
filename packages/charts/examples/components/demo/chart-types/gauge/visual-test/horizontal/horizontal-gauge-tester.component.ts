import { Component, Input, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeService,
    IAccessors,
    IChartAssistSeries,
    IGaugeThreshold,
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
    @Input() public value = 42;
    @Input() public max: number = 200;
    @Input() public thresholds: IGaugeThreshold[];

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    constructor(private gaugeService: GaugeService) { }

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Horizontal) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.seriesSet = this.gaugeService.assembleSeriesSet(this.value, this.max, this.thresholds, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }
}
