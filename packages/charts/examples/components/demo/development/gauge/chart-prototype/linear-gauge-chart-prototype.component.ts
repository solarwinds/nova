import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    BarHorizontalGridConfig,
    Chart,
    ChartAssist,
    GaugeService,
    HorizontalBarAccessors,
    IChartAssistSeries,
    IGaugeThreshold,
    stack,
    XYGrid
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-chart-prototype",
    templateUrl: "./linear-gauge-chart-prototype.component.html",
    styleUrls: ["./linear-gauge-chart-prototype.component.less"],
})
export class LinearGaugeChartPrototypeComponent implements OnChanges, OnInit {
    @Input() public value = 42;
    @Input() public max: number = 200;
    @Input() public thickness = 20;
    @Input() public thresholds: IGaugeThreshold[];

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<HorizontalBarAccessors>[];

    constructor(private gaugeService: GaugeService) { }

    public ngOnChanges(changes: ComponentChanges<LinearGaugeChartPrototypeComponent>) {
        if ((changes.thickness && !changes.thickness.firstChange) || (changes.value && !changes.value.firstChange)) {
            if (changes.thickness) {
                this.chartAssist.chart.getGrid().config().dimension.height(this.thickness);
                this.chartAssist.chart.updateDimensions();
            }
            this.chartAssist.update(this.gaugeService.updateLinearSeriesSet(this.value, this.max, this.thresholds, this.seriesSet));
        }
    }

    public ngOnInit() {
        const gridConfig = new BarHorizontalGridConfig();
        gridConfig.axis.left.visible = false;
        gridConfig.axis.bottom.visible = false;
        gridConfig.axis.bottom.gridTicks = false;
        gridConfig.dimension.padding.top = 0;
        gridConfig.dimension.padding.right = 0;
        gridConfig.dimension.padding.bottom = 0;
        gridConfig.dimension.padding.left = 0;
        gridConfig.dimension.margin.top = 0;
        gridConfig.dimension.margin.right = 0;
        gridConfig.dimension.margin.bottom = 0;
        gridConfig.dimension.margin.left = 0;
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.height(this.thickness);
        gridConfig.borders.left.visible = false;
        gridConfig.borders.bottom.visible = false;
        const grid = new XYGrid(gridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.seriesSet = this.gaugeService.assembleLinearSeriesSet(this.value, this.max, this.thresholds);
        this.updateThickness();
        this.chartAssist.update(this.seriesSet);
    }

    private updateThickness() {
        // this.seriesSet.forEach(series => {
        //     (series.renderer.config as IBarRendererConfig).thickness = this.thickness;
        // });
    }
}
