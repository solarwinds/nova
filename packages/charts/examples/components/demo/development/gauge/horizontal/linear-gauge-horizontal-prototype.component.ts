import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    linearGaugeGridConfig,
    LinearGaugeLabelsPlugin,
    LINEAR_GAUGE_LABEL_CLEARANCE_DEFAULTS,
    stack,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-horizontal-prototype",
    templateUrl: "./linear-gauge-horizontal-prototype.component.html",
    styleUrls: ["./linear-gauge-horizontal-prototype.component.less"],
})
export class LinearGaugeHorizontalPrototypeComponent implements OnChanges, OnInit {
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];
    private labelsPlugin: LinearGaugeLabelsPlugin;
    private readonly rightMargin = 15;
    private readonly leftMargin = 5;

    public ngOnChanges(changes: ComponentChanges<LinearGaugeHorizontalPrototypeComponent>): void {
        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            const gridConfig = this.chartAssist.chart.getGrid().config();
            gridConfig.dimension.height(this.gaugeConfig.linearThickness ?? 0);
            const flippedLabels = this.gaugeConfig.labels?.flipped ?? false;
            this.labelsPlugin.config.flippedLabels = flippedLabels;

            // update the margins to accommodate the label direction change
            const disableMarkers = this.gaugeConfig.thresholds?.disableMarkers ?? false;
            gridConfig.dimension.margin = {
                top: 0,
                right: disableMarkers ? 0 : this.rightMargin,
                bottom: 0,
                left: disableMarkers ? 0 : this.leftMargin,
            };

            if (!disableMarkers) {
                const marginToUpdate = flippedLabels ? "top" : "bottom";
                gridConfig.dimension.margin[marginToUpdate] = LINEAR_GAUGE_LABEL_CLEARANCE_DEFAULTS[marginToUpdate];
            }
            this.chartAssist.chart.updateDimensions();

            this.labelsPlugin.config.disableThresholdLabels = disableMarkers;
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        const gridConfig = linearGaugeGridConfig(this.gaugeConfig, GaugeMode.Horizontal) as XYGridConfig;
        gridConfig.dimension.margin.right = this.rightMargin;
        gridConfig.dimension.margin.left = this.leftMargin;
        const grid = new XYGrid(gridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.labelsPlugin = new LinearGaugeLabelsPlugin({ flippedLabels: this.gaugeConfig.labels?.flipped });
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }
}
