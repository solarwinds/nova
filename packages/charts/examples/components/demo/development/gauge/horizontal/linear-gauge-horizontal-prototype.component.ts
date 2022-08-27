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
export class LinearGaugeHorizontalPrototypeComponent
    implements OnChanges, OnInit
{
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];
    private labelsPlugin: LinearGaugeLabelsPlugin;

    public ngOnChanges(
        changes: ComponentChanges<LinearGaugeHorizontalPrototypeComponent>
    ): void {
        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            const gridConfig = this.chartAssist.chart.getGrid().config();
            gridConfig.dimension.height(this.gaugeConfig.linearThickness ?? 0);

            this.labelsPlugin.config.flippedLabels =
                this.gaugeConfig.labels?.flipped ?? false;
            this.labelsPlugin.config.disableThresholdLabels =
                this.gaugeConfig.thresholds?.disableMarkers ?? false;

            // update the margins to accommodate label direction changes
            this.configureMargins();

            this.chartAssist.chart.updateDimensions();
            this.chartAssist.update(
                GaugeUtil.update(this.seriesSet, this.gaugeConfig)
            );
        }
    }

    public ngOnInit(): void {
        this.labelsPlugin = new LinearGaugeLabelsPlugin({
            flippedLabels: this.gaugeConfig.labels?.flipped,
        });
        this.chartAssist = GaugeUtil.createChartAssist(
            this.gaugeConfig,
            GaugeMode.Horizontal,
            this.labelsPlugin
        );
        this.configureMargins();

        this.seriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Horizontal
        );
        this.chartAssist.update(this.seriesSet);
    }

    private configureMargins() {
        const gridConfig = this.chartAssist.chart.getGrid().config();

        // set baseline margins
        gridConfig.dimension.margin = {
            top: 5,
            right: 15,
            bottom: 5,
            left: 5,
        };

        // set clearance margin for threshold labels
        gridConfig.dimension.margin = GaugeUtil.getMarginForLabelClearance(
            this.gaugeConfig,
            GaugeMode.Horizontal,
            gridConfig.dimension.margin
        );
    }
}
