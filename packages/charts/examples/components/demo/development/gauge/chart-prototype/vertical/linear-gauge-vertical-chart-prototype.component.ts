import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    BarGridConfig,
    Chart,
    ChartAssist,
    GAUGE_THICKNESS_DEFAULT,
    GaugeMode,
    GaugeUtil,
    HorizontalBarAccessors,
    IAccessors,
    IChartAssistSeries,
    IGaugeThreshold,
    linearGaugeGridConfig,
    stack,
    XYGrid,
    XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-vertical-chart-prototype",
    templateUrl: "./linear-gauge-vertical-chart-prototype.component.html",
    styleUrls: ["./linear-gauge-vertical-chart-prototype.component.less"],
})
export class LinearGaugeChartVerticalPrototypeComponent implements OnChanges, OnInit {
    @Input() public value = 42;
    @Input() public max: number = 200;
    @Input() public thickness = GAUGE_THICKNESS_DEFAULT;
    @Input() public thresholds: IGaugeThreshold[];

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<LinearGaugeChartVerticalPrototypeComponent>) {
        if ((changes.thickness && !changes.thickness.firstChange) || (changes.value && !changes.value.firstChange)) {
            if (changes.thickness) {
                this.chartAssist.chart.getGrid().config().dimension.width(this.thickness);
                this.chartAssist.chart.updateDimensions();
            }
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.value, this.max, this.thresholds, this.seriesSet));
        }
    }

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Vertical, this.thickness) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.value, this.max, this.thresholds, GaugeMode.Vertical);
        this.chartAssist.update(this.seriesSet);
    }
}
