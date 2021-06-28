import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    LinearGaugeLabelsPlugin,
    LINEAR_GAUGE_LABEL_CLEARANCE_DEFAULTS,
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
            this.labelsPlugin.config.disableThresholdLabels = disableMarkers;
            gridConfig.dimension.margin = {
                top: 0,
                right: disableMarkers ? 0 : this.rightMargin,
                bottom: 0,
                left: disableMarkers ? 0 : this.leftMargin,
            };

            const marginToUpdate = flippedLabels ? "top" : "bottom";
            gridConfig.dimension.margin[marginToUpdate] = LINEAR_GAUGE_LABEL_CLEARANCE_DEFAULTS[marginToUpdate];

            this.chartAssist.chart.updateDimensions();
            this.chartAssist.update(GaugeUtil.update(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        this.labelsPlugin = new LinearGaugeLabelsPlugin({ flippedLabels: this.gaugeConfig.labels?.flipped });
        this.chartAssist = GaugeUtil.createChartAssist(this.gaugeConfig, GaugeMode.Horizontal, this.labelsPlugin);
        const gridConfig = this.chartAssist.chart.getGrid().config();
        gridConfig.dimension.margin.right = this.rightMargin;
        gridConfig.dimension.margin.left = this.leftMargin;

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }
}
