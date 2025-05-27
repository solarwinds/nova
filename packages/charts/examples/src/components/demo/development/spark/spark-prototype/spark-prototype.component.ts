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
    ChartPalette,
    CHART_MARKERS,
    CHART_PALETTE_CS1,
    IChartPalette,
    ILineAccessors,
    ISpark,
    LineAccessors,
    LinearScale,
    LineRenderer,
    SequentialChartMarkerProvider,
    SparkChartAssist,
} from "@nova-ui/charts";

import { DataGenerator } from "../../../../../data-generator";

/**
 * This is here just to test a prototype of an angular component that will use Nova Charts
 */
@Component({
    selector: "nui-spark-prototype",
    templateUrl: "./spark-prototype.component.html",
    styleUrls: ["./spark-prototype.component.less"],
})
export class SparkPrototypeComponent implements OnInit {
    public chartAssist: SparkChartAssist;
    public colorPalette: IChartPalette = new ChartPalette(CHART_PALETTE_CS1);
    public markers = new SequentialChartMarkerProvider(CHART_MARKERS);

    private sparkLineRenderer: LineRenderer;
    private sparkXScale = new LinearScale();

    public ngOnInit(): void {
        this.sparkLineRenderer = new LineRenderer();

        this.sparkXScale.formatters.tick = (value: any) =>
            Math.round(value).toString();
        this.chartAssist = new SparkChartAssist();

        this.update();
    }

    public update(): void {
        this.chartAssist.updateSparks(
            this.generateSparkSeriesSet(Math.floor(Math.random() * 6 + 1))
        );
    }

    private generateSparkSeriesSet(
        numSparks: number
    ): ISpark<ILineAccessors>[] {
        const sparks: ISpark<ILineAccessors>[] = [];
        const accessors = new LineAccessors(
            this.colorPalette.standardColors,
            this.markers
        );

        for (let i = 0; i < numSparks; ++i) {
            const sparkYScale = new LinearScale();
            sparkYScale.formatters.value = (v) => Number(v).toPrecision(4);
            const sparkScales = {
                x: this.sparkXScale,
                y: sparkYScale,
            };

            sparks.push({
                id: `${i}`,
                chartSeriesSet: [
                    {
                        id: `spark-series-${i + 1}`,
                        name: `Spark Series ${i + 1}`,
                        accessors,
                        data: DataGenerator.mockLineData(10),
                        scales: sparkScales,
                        renderer: this.sparkLineRenderer,
                    },
                    {
                        id: `spark-series-${i + 1}-b`,
                        name: `Spark Series ${i + 1}-b`,
                        accessors,
                        data: DataGenerator.mockLineData(10),
                        scales: sparkScales,
                        renderer: this.sparkLineRenderer,
                    },
                ],
            });
        }

        return sparks;
    }
}
