import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    ChartAssist,
    ChartDonutContentPlugin,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IRadialRendererConfig,
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
            this.labelsPlugin.config.disableThresholdLabels = this.gaugeConfig.thresholds?.disableMarkers ?? false;

            this.chartAssist.chart.updateDimensions();
            this.chartAssist.update(GaugeUtil.update(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        const gaugeConfigWithLabelClearance = { ...this.gaugeConfig, labels: { ...this.gaugeConfig.labels, clearance: this.labelClearance } };

        this.labelsPlugin = new DonutGaugeLabelsPlugin();
        this.chartAssist = GaugeUtil.createChartAssist(gaugeConfigWithLabelClearance, GaugeMode.Donut, this.labelsPlugin);
        const gridConfig = this.chartAssist.chart.getGrid().config();
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.autoWidth = false;

        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfigWithLabelClearance, GaugeMode.Donut);

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
