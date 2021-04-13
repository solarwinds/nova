import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeLabelsPluginConfig,
    IGaugeSeriesConfig,
    radial,
    radialGrid,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-prototype",
    templateUrl: "./donut-gauge-prototype.component.html",
    styleUrls: ["./donut-gauge-prototype.component.less"],
})
export class DonutGaugePrototypeComponent implements OnChanges, OnInit {
    @Input() public size: number;
    @Input() public seriesConfig: IGaugeSeriesConfig;

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<DonutGaugePrototypeComponent>) {
        if (changes.size && !changes.size.firstChange) {
                this.updateDonutSize();
                this.chartAssist.chart.updateDimensions();
        }

        if (changes.seriesConfig && !changes.seriesConfig.firstChange) {
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.seriesConfig));
        }
    }

    public ngOnInit() {
        const grid = radialGrid();
        grid.config().dimension.autoHeight = false;
        grid.config().dimension.autoWidth = false;
        this.chartAssist = new ChartAssist(new Chart(grid), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);
        const labelConfig: IGaugeLabelsPluginConfig = {
            clearance: { top: 40, right: 40, bottom: 40, left: 40 },
        };
        this.chartAssist.chart.addPlugin(new DonutGaugeLabelsPlugin(labelConfig));

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.seriesConfig, GaugeMode.Donut);
        this.seriesSet = GaugeUtil.setThresholdLabelFormatter((d: string) => `${d}ms`, this.seriesSet);

        this.updateDonutSize();
        this.chartAssist.update(this.seriesSet);
    }

    private updateDonutSize() {
        const gridDimensions = this.chartAssist.chart.getGrid().config().dimension;
        gridDimensions.height(this.size);
        gridDimensions.width(this.size);
    }
}
