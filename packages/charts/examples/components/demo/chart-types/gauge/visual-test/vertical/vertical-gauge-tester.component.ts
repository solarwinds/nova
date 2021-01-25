import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    BarGridConfig,
    Chart,
    ChartAssist,
    GAUGE_THICKNESS_DEFAULT,
    GaugeMode,
    GaugeService,
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
    selector: "vertical-gauge-tester",
    templateUrl: "./vertical-gauge-tester.component.html",
    styleUrls: ["./vertical-gauge-tester.component.less"],
})
export class VerticalGaugeTesterComponent implements OnChanges, OnInit {
    @Input() public value = 42;
    @Input() public max: number = 200;
    @Input() public thickness = GAUGE_THICKNESS_DEFAULT;
    @Input() public thresholds: IGaugeThreshold[];

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    constructor(private gaugeService: GaugeService) { }

    public ngOnChanges(changes: ComponentChanges<VerticalGaugeTesterComponent>) {
        if ((changes.thickness && !changes.thickness.firstChange) || (changes.value && !changes.value.firstChange)) {
            if (changes.thickness) {
                this.chartAssist.chart.getGrid().config().dimension.width(this.thickness);
                this.chartAssist.chart.updateDimensions();
            }
            this.chartAssist.update(this.gaugeService.updateSeriesSet(this.value, this.max, this.thresholds, this.seriesSet));
        }
    }

    public ngOnInit() {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Vertical, this.thickness) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.seriesSet = this.gaugeService.assembleSeriesSet(this.value, this.max, this.thresholds, GaugeMode.Vertical);
        this.chartAssist.update(this.seriesSet);
    }
}
