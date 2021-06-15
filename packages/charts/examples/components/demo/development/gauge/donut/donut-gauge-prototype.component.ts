import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges, UnitConversionService } from "@nova-ui/bits";
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

    constructor(private unitConversionService: UnitConversionService) { }

    public ngOnChanges(changes: ComponentChanges<DonutGaugePrototypeComponent>): void {
        if ((changes.size && !changes.size.firstChange) ||
            (changes.annularWidth && !changes.annularWidth.firstChange) ||
            (changes.annularGrowth && !changes.annularGrowth.firstChange)) {
            this.updateDonutSize();
            this.updateAnnularAttributes();
            this.chartAssist.chart.updateDimensions();
        }

        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            this.labelsPlugin.config.disableThresholdLabels = this.gaugeConfig.disableThresholdMarkers;
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        const grid = radialGrid();
        grid.config().dimension.autoHeight = false;
        grid.config().dimension.autoWidth = false;
        this.chartAssist = new ChartAssist(new Chart(grid), radial);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);
        const labelConfig: IGaugeLabelsPluginConfig = {
            clearance: { top: 40, right: 40, bottom: 40, left: 40 },
        };

        this.labelsPlugin = new DonutGaugeLabelsPlugin(labelConfig);
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Donut);
        this.seriesSet = GaugeUtil.setThresholdLabelFormatter((d: string) => {
            const conversion = this.unitConversionService.convert(parseInt(d, 10), 1000, 2);
            return this.unitConversionService.getFullDisplay(conversion, "generic");
        }, this.seriesSet);

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
