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

import { Component, OnInit } from "@angular/core";

import {
    ChartAssist,
    GaugeMode,
    GaugeUtil,
    IAccessors,
    IChartAssistSeries,
    IGaugeConfig,
    IGaugeThresholdsConfig,
    StandardGaugeThresholdMarkerRadius,
    StandardLinearGaugeThickness,
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-thickness-adjustment-example",
    templateUrl: "./linear-gauge-thickness-adjustment.example.component.html",
    styleUrls: ["./linear-gauge-thickness-adjustment.example.component.less"],
})
export class LinearGaugeThicknessAdjustmentExampleComponent implements OnInit {
    public gaugeConfig: IGaugeConfig;
    public horizontalChartAssist: ChartAssist;
    public verticalChartAssist: ChartAssist;

    public value = 64;
    public compact = true;

    private horizontalSeriesSet: IChartAssistSeries<IAccessors>[];
    private verticalSeriesSet: IChartAssistSeries<IAccessors>[];

    private thresholds: IGaugeThresholdsConfig =
        GaugeUtil.createStandardThresholdsConfig(50, 79);

    public ngOnInit(): void {
        // Setting the initial threshold marker radius
        this.thresholds.markerRadius = this.compact
            ? StandardGaugeThresholdMarkerRadius.Small
            : StandardGaugeThresholdMarkerRadius.Large;

        this.gaugeConfig = this.getGaugeConfig();

        // Creating the horizontal gauge
        this.horizontalChartAssist = GaugeUtil.createChartAssist(
            this.gaugeConfig,
            GaugeMode.Horizontal
        );
        this.horizontalSeriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Horizontal
        );
        this.horizontalChartAssist.update(this.horizontalSeriesSet);

        // Creating the vertical gauge
        this.verticalChartAssist = GaugeUtil.createChartAssist(
            this.gaugeConfig,
            GaugeMode.Vertical
        );
        this.verticalSeriesSet = GaugeUtil.assembleSeriesSet(
            this.gaugeConfig,
            GaugeMode.Vertical
        );
        this.verticalChartAssist.update(this.verticalSeriesSet);
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.updateGauges();
    }

    public onCompactChange(compact: boolean): void {
        this.compact = compact;

        // Adjusting the threshold marker radius
        this.thresholds.markerRadius = this.compact
            ? StandardGaugeThresholdMarkerRadius.Small
            : StandardGaugeThresholdMarkerRadius.Large;
        this.updateGauges();

        // Updating the thickness
        this.updateThickness();
    }

    private updateThickness() {
        // Using standard thicknesses based on whether the gauge is in compact mode
        const thickness = this.compact
            ? StandardLinearGaugeThickness.Small
            : StandardLinearGaugeThickness.Large;

        // Updating the horizontal gauge height with the desired gauge thickness in pixels
        const horizontalGridConfig = this.horizontalChartAssist.chart
            .getGrid()
            .config();
        horizontalGridConfig.dimension.height(thickness);
        this.horizontalChartAssist.chart.updateDimensions();

        // Updating the vertical gauge width with the desired gauge thickness in pixels
        const verticalGridConfig = this.verticalChartAssist.chart
            .getGrid()
            .config();
        verticalGridConfig.dimension.width(thickness);
        this.verticalChartAssist.chart.updateDimensions();
    }

    private updateGauges() {
        this.gaugeConfig = this.getGaugeConfig();

        // Updating the horizontal gauge
        this.horizontalSeriesSet = GaugeUtil.update(
            this.horizontalSeriesSet,
            this.gaugeConfig
        );
        this.horizontalChartAssist.update(this.horizontalSeriesSet);

        // Updating the vertical gauge
        this.verticalSeriesSet = GaugeUtil.update(
            this.verticalSeriesSet,
            this.gaugeConfig
        );
        this.verticalChartAssist.update(this.verticalSeriesSet);
    }

    private getGaugeConfig(): IGaugeConfig {
        return {
            value: this.value,
            max: 100,
            thresholds: this.thresholds,

            // Setting the initial thickness based on whether the gauge is in compact mode
            // The 'createChartAssist' function uses this to configure the grid's dimensions
            linearThickness: this.compact
                ? StandardLinearGaugeThickness.Small
                : StandardLinearGaugeThickness.Large,
        };
    }
}
