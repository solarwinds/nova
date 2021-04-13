import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeSeriesConfig,
    linearGaugeGridConfig,
    LinearGaugeLabelsPlugin,
    stack,
    XYGrid,
    XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-horizontal-prototype",
    templateUrl: "./linear-gauge-horizontal-prototype.component.html",
    styleUrls: ["./linear-gauge-horizontal-prototype.component.less"],
})
export class LinearGaugeHorizontalPrototypeComponent implements OnChanges, OnInit {
    @Input() public thickness: number;
    @Input() public seriesConfig: IGaugeSeriesConfig;
    @Input() public flipLabels = false;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];
    private labelsPlugin: LinearGaugeLabelsPlugin;

    public ngOnChanges(changes: ComponentChanges<LinearGaugeHorizontalPrototypeComponent>) {
        if ((changes.thickness && !changes.thickness.firstChange) || (changes.flipLabels && !changes.flipLabels.firstChange)) {
            const gridConfig = this.chartAssist.chart.getGrid().config();
            if (changes.thickness) {
                gridConfig.dimension.height(this.thickness);
            }
            if (changes.flipLabels) {
                this.labelsPlugin.config.flipLabels = this.flipLabels;
                // reset the margins to accommodate the label direction change
                gridConfig.dimension.margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
            }
            this.chartAssist.chart.updateDimensions();
        }

        if (changes.seriesConfig && !changes.seriesConfig.firstChange) {
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.seriesConfig));
        }
    }

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Horizontal, this.thickness) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.labelsPlugin = new LinearGaugeLabelsPlugin({ flipLabels: this.flipLabels });
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.seriesConfig, GaugeMode.Horizontal);
        this.seriesSet = GaugeUtil.setThresholdLabelFormatter((d: string) => `${d}ms`, this.seriesSet);

        this.chartAssist.update(this.seriesSet);
    }
}
