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
import moment from "moment/moment";

import {
    Chart,
    IChartSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    SequentialColorProvider,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

interface ChartDatum {
    x: moment.Moment;
    y: number;
}

@Component({
    selector: "nui-line-chart-test",
    templateUrl: "./line-chart-test.component.html",
})
export class LineChartTestComponent implements OnInit {
    public input: string;
    public chart: Chart;
    private seriesSet: IChartSeries<ILineAccessors>[];
    private initialInput = [
        [30, 95, 15, 60, 35],
        [60, 40, 70, 45, 90],
    ];

    public ngOnInit(): void {
        this.input = JSON.stringify(this.initialInput);
        this.configureChart();
        this.buildSeriesSet();

        this.update(this.initialInput);
    }

    public inputChanged(value: string): void {
        this.update(JSON.parse(value));
    }

    private update(input: number[][]) {
        this.seriesSet.forEach((s: IChartSeries<ILineAccessors>, i: number) => {
            const seriesInput = input[i] || [];
            s.data.forEach((datum: ChartDatum, j: number) => {
                const newValue = seriesInput[j] || 0;
                datum.y = newValue;
            });
        });

        this.chart.update(this.seriesSet);
    }

    private configureChart() {
        const gridConfig = new XYGridConfig();
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.height(110);
        gridConfig.dimension.width(400);
        this.chart = new Chart(new XYGrid(gridConfig));
    }

    private buildSeriesSet() {
        const colors = [
            "red",
            "orange",
            "yellow",
            "green",
            "blue",
            "purple",
            "black",
            "white",
        ];
        const dates = [
            "2016-12-25",
            "2016-12-26",
            "2016-12-27",
            "2016-12-28",
            "2016-12-29",
        ];
        const format = "YYYY-MM-DD";
        const renderer = new LineRenderer();
        const accessors = new LineAccessors(
            new SequentialColorProvider(colors)
        );
        const yScale = new LinearScale();
        yScale.fixDomain([0, 100]);
        const scales: IXYScales = {
            x: new TimeScale(),
            y: yScale,
        };

        this.seriesSet = [
            {
                id: "1",
                name: "Series 1",
                data: dates.map((d: string) => ({
                    x: moment(d, format),
                    y: 0,
                })),
            },
            {
                id: "2",
                name: "Series 2",
                data: dates.map((d: string) => ({
                    x: moment(d, format),
                    y: 0,
                })),
            },
        ].map((s) => ({ ...s, scales, renderer, accessors }));
    }
}
