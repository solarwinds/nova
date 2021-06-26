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
    IGaugeConfig,
    IRadialRendererConfig,
    radial,
    radialGrid,
    gaugeGrid,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-prototype",
    templateUrl: "./donut-gauge-prototype.component.html",
    styleUrls: ["./donut-gauge-prototype.component.less"],
})
export class DonutGaugePrototypeComponent implements OnChanges, OnInit {
    @Input() public size: number;
    @Input() public annularGrowth: number;
    @Input() public annularWidth: number;
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    private labelsPlugin: DonutGaugeLabelsPlugin;
    private readonly labelClearance = 40;

    public ngOnChanges(changes: ComponentChanges<DonutGaugePrototypeComponent>): void {
        if ((changes.size && !changes.size.firstChange) ||
            (changes.annularWidth && !changes.annularWidth.firstChange) ||
            (changes.annularGrowth && !changes.annularGrowth.firstChange)) {
            this.updateDonutSize();
            this.updateAnnularAttributes();
            this.chartAssist.chart.updateDimensions();
        }

        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            const disableMarkers = this.gaugeConfig.thresholds?.disableMarkers ?? false;
            this.labelsPlugin.config.disableThresholdLabels = disableMarkers;

            const gridConfig = this.chartAssist.chart.getGrid().config();
            const clearance = disableMarkers ? 0 : this.labelClearance;
            gridConfig.dimension.margin = {
                top: clearance,
                right: clearance,
                bottom: clearance,
                left: clearance,
            };

            this.chartAssist.chart.updateDimensions();
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        const gaugeConfigWithLabelClearance = { ...this.gaugeConfig, labels: { ...this.gaugeConfig.labels, clearance: this.labelClearance } };
        const grid = gaugeGrid(gaugeConfigWithLabelClearance, GaugeMode.Donut);
        grid.config().dimension.autoHeight = false;
        grid.config().dimension.autoWidth = false;

        this.chartAssist = new ChartAssist(new Chart(grid), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        this.labelsPlugin = new DonutGaugeLabelsPlugin();
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);

        this.updateDonutSize();
        this.updateAnnularAttributes();
        this.chartAssist.update(this.seriesSet);
    }

    private updateDonutSize(): void {
        const gridDimensions = this.chartAssist.chart.getGrid().config().dimension;
        gridDimensions.height(this.size);
        gridDimensions.width(this.size);
    }

    private updateAnnularAttributes(): void {
        this.seriesSet.forEach(series => {
            const rendererConfig = (series.renderer.config as IRadialRendererConfig);
            // increase the max thickness from 30 for testing purposes
            rendererConfig.maxThickness = 20000;
            rendererConfig.annularGrowth = this.annularGrowth;
            rendererConfig.annularWidth = this.annularWidth;
        });
    }
}
