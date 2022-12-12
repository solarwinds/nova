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
    LineAccessors,
    LinearScale,
    LineRenderer,
    SequentialColorProvider,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

const rand = (lower: number, upper: number): number =>
    lower + Math.round(Math.random() * (upper - lower));

const range = (count: number) =>
    new Array(count).fill(null).map((_, index) => index);

const createRandomData = () =>
    range(rand(3, 12)).map(() => range(rand(3, 12)).map(() => rand(0, 100)));

@Component({
    selector: "nui-line-chart-stacked-test",
    templateUrl: "./line-chart-stacked-test.component.html",
})
export class LineChartStackedTestComponent implements OnInit {
    public collectionId = "";

    public input: string;
    public chart1: Chart;
    public chart2: Chart;
    public chart3: Chart;

    private seriesSet: IChartSeries<ILineAccessors>[];
    private initialInput = [
        [30, 95, 15, 60, 35],
        [60, 40, 70, 45, 90],
        [30, 95, 15, 60, 35],
        [60, 40, 70, 45, 90],
    ];

    public ngOnInit(): void {
        this.input = JSON.stringify(this.initialInput);
        this.configureCharts();

        this.update(this.initialInput);
    }

    public inputChanged(value: string): void {
        this.update(JSON.parse(value));
    }

    public generateRandomData(): void {
        const data = createRandomData();
        this.input = JSON.stringify(data);
        this.update(data);
    }

    private update(input: number[][]) {
        this.seriesSet = this.buildSeriesSet(input);
        const serieCount = this.seriesSet.length;

        const charts = [this.chart1, this.chart2, this.chart3];
        const chartCount = charts.length;

        charts.forEach((chart, chartIndex) => {
            const lower = Math.round((serieCount * chartIndex) / chartCount);
            const upper = Math.round(
                (serieCount * (chartIndex + 1)) / chartCount
            );
            chart.update(this.seriesSet.slice(lower, upper));
        });
    }

    private configureCharts() {
        const gridConfig = new XYGridConfig();
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.height(110);
        gridConfig.dimension.width(400);
        this.chart1 = new Chart(new XYGrid(gridConfig));
        this.chart2 = new Chart(new XYGrid(gridConfig));
        this.chart3 = new Chart(new XYGrid(gridConfig));
    }

    private buildSeriesSet(input: number[][]): IChartSeries<ILineAccessors>[] {
        const colors = [
            "red",
            "orange",
            "yellow",
            "lime",
            "green",
            "blue",
            "purple",
            "black",
            "gray",
            "olive",
            "gold",
            "silver",
        ];
        const format = "YYYY-MM-DD";
        const renderer = new LineRenderer();
        const accessors = new LineAccessors(
            new SequentialColorProvider(colors)
        );
        const yScale = new LinearScale();
        yScale.fixDomain([0, 100]);

        return input.map((row, rowIndex) => ({
            id: `series-${rowIndex}`,
            name: "Series ${index + 1}",
            data: row.map((value, valueIndex) => ({
                x: moment("2020-01-15", format).add(
                    (24 * 7 * valueIndex) / (row.length - 1),
                    "hour"
                ),
                y: value,
            })),
            scales: {
                x: new TimeScale(),
                y: yScale,
            },
            renderer,
            accessors,
        }));
    }

    public onSyncUpdate(value: boolean): void {
        this.collectionId = value ? "test-collection" : "";
    }
}
