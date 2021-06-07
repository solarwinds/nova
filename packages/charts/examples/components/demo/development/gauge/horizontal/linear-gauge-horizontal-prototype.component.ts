import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges, UnitConversionService } from "@nova-ui/bits";
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
    @Input() public thickness: number;
    @Input() public gaugeConfig: IGaugeConfig;
    @Input() public flipLabels = false;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];
    private labelsPlugin: LinearGaugeLabelsPlugin;

    constructor(private unitConversionService: UnitConversionService) { }

    public ngOnChanges(changes: ComponentChanges<LinearGaugeHorizontalPrototypeComponent>): void {
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

        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            this.labelsPlugin.config.disableThresholdLabels = this.gaugeConfig.disableThresholdMarkers;
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        const grid = new XYGrid(linearGaugeGridConfig(GaugeMode.Horizontal, this.thickness) as XYGridConfig);
        const chart = new Chart(grid);

        this.chartAssist = new ChartAssist(chart, stack);

        this.labelsPlugin = new LinearGaugeLabelsPlugin({ flipLabels: this.flipLabels });
        this.chartAssist.chart.addPlugin(this.labelsPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Horizontal);
        this.seriesSet = GaugeUtil.setThresholdLabelFormatter((d: string) => {
            const conversion = this.unitConversionService.convert(parseInt(d, 10), 1000, 2);
            return this.unitConversionService.getFullDisplay(conversion, "generic");
        }, this.seriesSet);

        this.chartAssist.update(this.seriesSet);
    }
}
