import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    GAUGE_THICKNESS_DEFAULT,
    IAccessors,
    IChartAssistSeries,
    IDonutGaugeLabelsPluginConfig,
    IGaugeSeriesConfig,
    IRadialRendererConfig,
    radial,
    radialGrid
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-prototype",
    templateUrl: "./donut-gauge-prototype.component.html",
    styleUrls: ["./donut-gauge-prototype.component.less"],
})
export class DonutGaugePrototypeComponent implements OnChanges, OnInit {
    @Input() public annularWidth = GAUGE_THICKNESS_DEFAULT;
    @Input() public seriesConfig: IGaugeSeriesConfig;

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<DonutGaugePrototypeComponent>) {
        if ((changes.annularWidth && !changes.annularWidth.firstChange) || (changes.seriesConfig && !changes.seriesConfig.firstChange)) {
            if (changes.annularWidth) {
                this.updateAnnularWidth();
            }
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.seriesConfig));
        }
    }

    public ngOnInit() {
        const grid = radialGrid();
        this.chartAssist = new ChartAssist(new Chart(grid), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);
        const labelConfig: IDonutGaugeLabelsPluginConfig = {
            gridMargin: { top: 20, right: 20, bottom: 20, left: 20 },
        };
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin(labelConfig));

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.seriesConfig, GaugeMode.Donut);
        this.seriesSet = GaugeUtil.setThresholdLabelFormatter((d: string) => `${d}MS`, this.seriesSet);

        this.updateAnnularWidth();
        this.chartAssist.update(this.seriesSet);
    }

    private updateAnnularWidth() {
        this.seriesSet.forEach(series => {
            (series.renderer.config as IRadialRendererConfig).annularWidth = this.annularWidth;
        });
    }
}
