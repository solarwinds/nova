import { Component, Input, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    GaugeService,
    IChartAssistSeries,
    IGaugeThreshold,
    radial,
    RadialAccessors,
    radialGrid
} from "@nova-ui/charts";

@Component({
    selector: "gauge-tester",
    templateUrl: "./gauge-tester.component.html",
    styleUrls: ["./gauge-tester.component.less"],
})
export class GaugeTesterComponent implements OnInit {
    @Input() public value: number;
    @Input() public max: number = 200;
    @Input() public thresholds: IGaugeThreshold[];

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<RadialAccessors>[];

    constructor(private gaugeService: GaugeService) { }

    public ngOnInit() {
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        this.seriesSet = this.gaugeService.assembleRadialSeriesSet(this.value, this.max, this.thresholds);
        this.chartAssist.update(this.seriesSet);
    }
}
