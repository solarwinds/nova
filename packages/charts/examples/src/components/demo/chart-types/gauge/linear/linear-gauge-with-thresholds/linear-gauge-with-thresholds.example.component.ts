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
} from "@nova-ui/charts";

@Component({
    selector: "linear-gauge-with-thresholds-example",
    templateUrl: "./linear-gauge-with-thresholds.example.component.html",
    styleUrls: ["./linear-gauge-with-thresholds.example.component.less"],
})
export class LinearGaugeWithThresholdsExampleComponent implements OnInit {
    public horizontalChartAssist: ChartAssist;
    public verticalChartAssist: ChartAssist;
    public gaugeConfig: IGaugeConfig;
    public value = 64;

    private thresholds: IGaugeThresholdsConfig;
    private horizontalSeriesSet: IChartAssistSeries<IAccessors>[];
    private verticalSeriesSet: IChartAssistSeries<IAccessors>[];

    public ngOnInit(): void {
        // Generating a standard set of thresholds with warning and critical levels
        this.thresholds = GaugeUtil.createStandardThresholdsConfig(50, 79);

        /**
         * Optionally, instead of using the 'createStandardThresholdsConfig' function as above, you can manually create a thresholds
         * config object like the following with as many or as few threshold definitions as you need.
         */
        // this.thresholds = {
        //     definitions: {
        //         [StandardGaugeThresholdId.Warning]: {
        //             id: StandardGaugeThresholdId.Warning,
        //             value: 50,
        //             enabled: true,
        //             color: StandardGaugeColor.Warning,
        //         },
        //         [StandardGaugeThresholdId.Critical]: {
        //             id: StandardGaugeThresholdId.Critical,
        //             value: 79,
        //             enabled: true,
        //             color: StandardGaugeColor.Critical,
        //         },
        //     },
        //     reversed: false,
        //     disableMarkers: false,
        //     markerRadius: StandardGaugeThresholdMarkerRadius.Large,
        // };

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

            // Enabling the thresholds
            thresholds: this.thresholds,
        };
    }
}
