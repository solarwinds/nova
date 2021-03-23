import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    GaugeMode,
    GaugeUtil,
    GAUGE_THICKNESS_DEFAULT,
    IAccessors,
    IChartAssistSeries,
    IGaugeSeriesConfig,
    IRadialGaugeLabelsPluginConfig,
    IRadialRendererConfig,
    radial,
    RadialGaugeLabelsPlugin,
    radialGrid
} from "@nova-ui/charts";

@Component({
    selector: "radial-gauge-chart-prototype",
    templateUrl: "./radial-gauge-chart-prototype.component.html",
    styleUrls: ["./radial-gauge-chart-prototype.component.less"],
})
export class RadialGaugeChartPrototypeComponent implements OnChanges, OnInit {
    @Input() public annularWidth = GAUGE_THICKNESS_DEFAULT;
    @Input() public seriesConfig: IGaugeSeriesConfig;

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<RadialGaugeChartPrototypeComponent>) {
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
        const labelConfig: IRadialGaugeLabelsPluginConfig = {
            gridMargin: { top: 20, right: 20, bottom: 20, left: 20 },
        };
        this.chartAssist.chart.addPlugin(new RadialGaugeLabelsPlugin(labelConfig));

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.seriesConfig, GaugeMode.Radial);
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
