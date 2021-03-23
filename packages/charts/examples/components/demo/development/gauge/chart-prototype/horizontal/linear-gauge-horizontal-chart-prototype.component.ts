import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    GAUGE_THICKNESS_DEFAULT,
    IAccessors,
    IChartAssistSeries,
    IGaugeSeriesConfig,
    linearGaugeGridConfig,
    stack,
    XYGrid,
    XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-horizontal-chart-prototype",
    templateUrl: "./linear-gauge-horizontal-chart-prototype.component.html",
    styleUrls: ["./linear-gauge-horizontal-chart-prototype.component.less"],
})
export class LinearGaugeChartHorizontalPrototypeComponent implements OnChanges, OnInit {
    @Input() public thickness = GAUGE_THICKNESS_DEFAULT;
    @Input() public seriesConfig: IGaugeSeriesConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<LinearGaugeChartHorizontalPrototypeComponent>) {
        if ((changes.thickness && !changes.thickness.firstChange) || (changes.seriesConfig && !changes.seriesConfig.firstChange)) {
            if (changes.thickness) {
                this.chartAssist.chart.getGrid().config().dimension.height(this.thickness);
                this.chartAssist.chart.updateDimensions();
            }
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.seriesConfig));
        }
    }

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Horizontal, this.thickness) as XYGridConfig);
        grid.config().dimension.margin.right = 5;
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.seriesConfig, GaugeMode.Horizontal);
        this.chartAssist.update(this.seriesSet);
    }
}
