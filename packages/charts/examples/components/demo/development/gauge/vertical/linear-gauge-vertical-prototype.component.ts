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
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    LinearGaugeLabelsPlugin,
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-vertical-prototype",
    templateUrl: "./linear-gauge-vertical-prototype.component.html",
    styleUrls: ["./linear-gauge-vertical-prototype.component.less"],
})
export class LinearGaugeVerticalPrototypeComponent
    implements OnChanges, OnInit
{
    @Input() public gaugeConfig: IGaugeConfig;

    public chartAssist: ChartAssist;
    public seriesSet: IChartAssistSeries<IAccessors>[];
    private labelsPlugin: LinearGaugeLabelsPlugin;

    // extra clearance for the longer labels generated by the formatter
    private readonly labelClearance = 35;

    public ngOnChanges(
        changes: ComponentChanges<LinearGaugeVerticalPrototypeComponent>
    ): void {
        if (changes.gaugeConfig && !changes.gaugeConfig.firstChange) {
            const gridConfig = this.chartAssist.chart.getGrid().config();
            gridConfig.dimension.width(this.gaugeConfig.linearThickness ?? 0);

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
            GaugeMode.Vertical,
            this.labelsPlugin
        );
        this.configureMargins();

        this.seriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Vertical
        );
        this.chartAssist.update(this.seriesSet);
    }

    private configureMargins() {
        const gridConfig = this.chartAssist.chart.getGrid().config();

        // set baseline margins
        gridConfig.dimension.margin = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
        };

        // set clearance margin for threshold labels
        const gaugeConfigWithLabelClearance = {
            ...this.gaugeConfig,
            labels: {
                ...this.gaugeConfig.labels,
                clearance: this.labelClearance,
            },
        };
        gridConfig.dimension.margin = GaugeUtil.getMarginForLabelClearance(
            gaugeConfigWithLabelClearance,
            GaugeMode.Vertical,
            gridConfig.dimension.margin
        );
    }
}
