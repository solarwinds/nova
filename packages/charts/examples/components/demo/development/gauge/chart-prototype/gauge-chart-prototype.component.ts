import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    GaugeService,
    IChartAssistSeries,
    IGaugeThreshold,
    IRadialRendererConfig,
    radial,
    RadialAccessors,
    radialGrid
} from "@nova-ui/charts";

@Component({
    selector: "nui-gauge-chart-prototype",
    templateUrl: "./gauge-chart-prototype.component.html",
    styleUrls: ["./gauge-chart-prototype.component.less"],
})
export class GaugeChartPrototypeComponent implements OnChanges, OnInit {
    @Input() public value = 42;
    @Input() public max: number = 200;
    @Input() public annularWidth = 20;
    @Input() public thresholds: IGaugeThreshold[];

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<RadialAccessors>[];

    constructor(private gaugeService: GaugeService) { }

    public ngOnChanges(changes: ComponentChanges<GaugeChartPrototypeComponent>) {
        if ((changes.annularWidth && !changes.annularWidth.firstChange) || (changes.value && !changes.value.firstChange)) {
            if (changes.annularWidth) {
                this.updateAnnularWidth();
            }
            this.chartAssist.update(this.gaugeService.updateRadialSeriesSet(this.value, this.max, this.thresholds, this.seriesSet));
        }
    }

    public ngOnInit() {
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        this.seriesSet = this.gaugeService.assembleRadialSeriesSet(this.value, this.max, this.thresholds);
        this.updateAnnularWidth();
        this.chartAssist.update(this.seriesSet);
    }

    private updateAnnularWidth() {
        this.seriesSet.forEach(series => {
            (series.renderer.config as IRadialRendererConfig).annularWidth = this.annularWidth;
        });
    }
}
