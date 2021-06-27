import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeLabelsPluginConfig,
    IGaugeConfig,
    LinearGaugeLabelsPlugin,
    stack,
    XYGrid,
    XYGridConfig,
    linearGaugeGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-vertical-prototype",
    templateUrl: "./linear-gauge-vertical-prototype.component.html",
    styleUrls: ["./linear-gauge-vertical-prototype.component.less"],
})
export class LinearGaugeVerticalPrototypeComponent implements OnChanges, OnInit {
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];
    private labelsPlugin: LinearGaugeLabelsPlugin;
    // extra clearance for the longer labels generated by the formatter
    private labelClearance = 35;
    private readonly staticMargin = 5;

    public ngOnChanges(changes: ComponentChanges<LinearGaugeVerticalPrototypeComponent>): void {
        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            const gridConfig = this.chartAssist.chart.getGrid().config();
            gridConfig.dimension.width(this.gaugeConfig.linearThickness ?? 0);

            const flippedLabels = this.gaugeConfig.labels?.flipped ?? false;
            const disableMarkers = this.gaugeConfig.thresholds?.disableMarkers ?? false;
            this.labelsPlugin.config.flippedLabels = flippedLabels;
            this.labelsPlugin.config.disableThresholdLabels = disableMarkers;

            // update the margins to accommodate the label direction change
            const staticMargin = disableMarkers ? 0 : this.staticMargin;
            gridConfig.dimension.margin = {
                top: staticMargin,
                right: 0,
                bottom: staticMargin,
                left: 0,
            };

            if (!disableMarkers) {
                const marginToUpdate = flippedLabels ? "left" : "right";
                gridConfig.dimension.margin[marginToUpdate] = this.labelClearance;
            }

            this.chartAssist.chart.updateDimensions();
            this.chartAssist.update(GaugeUtil.update(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        const gaugeConfigWithLabelClearance = { ...this.gaugeConfig, labels: { ...this.gaugeConfig.labels, clearance: this.labelClearance } };
        const gridConfig = linearGaugeGridConfig(gaugeConfigWithLabelClearance, GaugeMode.Vertical) as XYGridConfig;
        gridConfig.dimension.margin.top = this.staticMargin;
        gridConfig.dimension.margin.bottom = this.staticMargin;
        const grid = new XYGrid(gridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.labelsPlugin = new LinearGaugeLabelsPlugin({ flippedLabels: this.gaugeConfig.labels?.flipped });
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Vertical);
        this.chartAssist.update(this.seriesSet);
    }
}
