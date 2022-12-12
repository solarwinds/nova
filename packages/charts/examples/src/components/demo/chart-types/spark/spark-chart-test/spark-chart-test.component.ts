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
import moment, { Moment } from "moment/moment";

import {
    Chart,
    ChartPalette,
    IChartAssistSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    SparkChartAssist,
    TimeScale,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-spark-chart-test",
    templateUrl: "./spark-chart-test.component.html",
})
export class SparkChartTestComponent implements OnInit {
    private colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "black",
        "white",
    ];
    private initialInput = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];
    private baseDate = moment([2016, 11, 25]);

    private xScale = new TimeScale();
    private renderer = new LineRenderer();
    private palette = new ChartPalette(this.colors);
    private accessors = new LineAccessors(this.palette.standardColors);
    public chartAssist: SparkChartAssist = new SparkChartAssist(
        true,
        true,
        this.palette
    );

    public input: string;
    public chart: Chart;

    public ngOnInit(): void {
        this.input = JSON.stringify(this.initialInput);
        this.configureGrid(this.chartAssist.gridConfig);
        this.configureGrid(this.chartAssist.lastGridConfig);
        this.update(this.initialInput);
    }

    public inputChanged(value: string): void {
        this.update(JSON.parse(value));
    }

    private update(input: number[][]) {
        const seriesSet = this.generateSparkSeriesSet(input);
        this.chartAssist.update(seriesSet);
    }

    private configureGrid(gridConfig: XYGridConfig) {
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.width(400);
    }

    private generateSparkSeriesSet(
        input: number[][]
    ): IChartAssistSeries<ILineAccessors>[] {
        return input.map((seriesData: number[], i: number) => {
            const sparkYScale = new LinearScale();
            sparkYScale.fixDomain([0, 26]); // spark chart height is 26px (36px - 5px top - 5px bottom padding)
            sparkYScale.formatters.value = (v) => Number(v).toPrecision(4);
            const sparkScales: IXYScales = {
                x: this.xScale,
                y: sparkYScale,
            };
            return {
                id: `${i + 1}`,
                name: `dev-aus-vm-0${i + 1}`,
                accessors: this.accessors,
                data: this.getData(seriesData),
                scales: sparkScales,
                renderer: this.renderer,
            } as IChartAssistSeries<ILineAccessors>;
        });
    }

    private getData(seriesData: number[]): { x: Moment; y: number }[] {
        return seriesData.map((value: number, i: number) => ({
            x: this.baseDate.clone().add(i, "days"),
            y: value,
        }));
    }
}
