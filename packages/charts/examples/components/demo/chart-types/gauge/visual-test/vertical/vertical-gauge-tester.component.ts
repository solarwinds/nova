import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ComponentChanges } from "@nova-ui/bits";
import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
} from "@nova-ui/charts";

@Component({
    selector: "vertical-gauge-tester",
    templateUrl: "./vertical-gauge-tester.component.html",
    styleUrls: ["./vertical-gauge-tester.component.less"],
})
export class VerticalGaugeTesterComponent implements OnInit, OnChanges {
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnChanges(changes: ComponentChanges<VerticalGaugeTesterComponent>): void {
        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            this.chartAssist.update(GaugeUtil.updateSeriesSet(this.seriesSet, this.gaugeConfig));
        }
    }

    public ngOnInit(): void {
        this.chartAssist = GaugeUtil.createChartAssist(this.gaugeConfig, GaugeMode.Vertical);
        this.seriesSet = GaugeUtil.assembleSeriesSet(this.gaugeConfig, GaugeMode.Vertical);
        this.chartAssist.update(this.seriesSet);
    }
}
