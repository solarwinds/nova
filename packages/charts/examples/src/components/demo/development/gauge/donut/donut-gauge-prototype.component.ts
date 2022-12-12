// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component, Input, OnChanges, OnInit } from "@angular/core";

import { ComponentChanges } from "@nova-ui/bits";
import {
    ChartAssist,
    ChartDonutContentPlugin,
    DonutGaugeLabelsPlugin,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IRadialRendererConfig,
} from "@nova-ui/charts";

@Component({
    selector: "donut-gauge-prototype",
    templateUrl: "./donut-gauge-prototype.component.html",
    styleUrls: ["./donut-gauge-prototype.component.less"],
})
export class DonutGaugePrototypeComponent implements OnChanges, OnInit {
    @Input() public size: number;
    @Input() public annularGrowth: number;
    @Input() public annularWidth: number;
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public seriesSet: IChartAssistSeries<IAccessors>[];

    private labelsPlugin: DonutGaugeLabelsPlugin;
    private readonly labelClearance = 40;

    public ngOnChanges(
        changes: ComponentChanges<DonutGaugePrototypeComponent>
    ): void {
        if (
            (changes.size && !changes.size.firstChange) ||
            (changes.annularWidth && !changes.annularWidth.firstChange) ||
            (changes.annularGrowth && !changes.annularGrowth.firstChange)
        ) {
            this.updateDonutSize();
            this.updateAnnularAttributes();
            this.chartAssist.chart.updateDimensions();
        }

        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            this.labelsPlugin.config.disableThresholdLabels =
                this.gaugeConfig.thresholds?.disableMarkers ?? false;

            this.chartAssist.chart.updateDimensions();
            this.chartAssist.update(
                GaugeUtil.update(this.seriesSet, this.gaugeConfig)
            );
        }
    }

    public ngOnInit(): void {
        const gaugeConfigWithLabelClearance = {
            ...this.gaugeConfig,
            labels: {
                ...this.gaugeConfig.labels,
                clearance: this.labelClearance,
            },
        };

        this.labelsPlugin = new DonutGaugeLabelsPlugin();
        this.chartAssist = GaugeUtil.createChartAssist(
            gaugeConfigWithLabelClearance,
            GaugeMode.Donut,
            this.labelsPlugin
        );
        const gridConfig = this.chartAssist.chart.getGrid().config();
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.autoWidth = false;

        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        this.seriesSet = GaugeUtil.assembleSeriesSet(
            gaugeConfigWithLabelClearance,
            GaugeMode.Donut
        );

        this.updateDonutSize();
        this.updateAnnularAttributes();
        this.chartAssist.update(this.seriesSet);
    }

    private updateDonutSize(): void {
        const gridDimensions = this.chartAssist.chart
            .getGrid()
            .config().dimension;
        gridDimensions.height(this.size);
        gridDimensions.width(this.size);
    }

    private updateAnnularAttributes(): void {
        this.seriesSet.forEach((series) => {
            const rendererConfig = series.renderer
                .config as IRadialRendererConfig;
            // increase the max thickness from 30 for testing purposes
            rendererConfig.maxThickness = 20000;
            rendererConfig.annularGrowth = this.annularGrowth;
            rendererConfig.annularWidth = this.annularWidth;
        });
    }
}
