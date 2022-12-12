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

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    QueryList,
    ViewChildren,
} from "@angular/core";

import {
    Chart,
    ChartAssist,
    ChartComponent,
    IAccessors,
    IChart,
    IChartAssistSeries,
    LineAccessors,
    LinearScale,
    LineRenderer,
    Scales,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

import { DataGenerator } from "../../../../../data-generator";

interface IMyChart {
    chart: IChart;
    chartAssist: ChartAssist;
    scales: Scales;
    renderer: LineRenderer;
    accessors: LineAccessors;
}

/**
 * This is here just to test a prototype of angular component, that will use new chart core
 *
 * @ignore
 */
@Component({
    selector: "nui-chart-collection-test",
    templateUrl: "./chart-collection-test.component.html",
})
export class ChartCollectionTestComponent implements OnInit, AfterViewInit {
    @ViewChildren(ChartComponent) charts: QueryList<ChartComponent>;

    public myCharts: IMyChart[] = [];
    private chartCount = 2;

    constructor(private changeDetection: ChangeDetectorRef) {
        for (let i = 0; i < this.chartCount; i++) {
            const chart = new Chart(new XYGrid());

            const myChart = {
                chart,
                chartAssist: new ChartAssist(chart),
                scales: { x: new TimeScale("x"), y: new LinearScale() },
                renderer: new LineRenderer(),
                accessors: new LineAccessors(),
            };
            this.myCharts.push(myChart);
        }
    }

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        this.myCharts.forEach((myChart, index: number) => {
            myChart.chartAssist.update(
                this.generateChartAssistSeriesSet(myChart, 4, index)
            );
        });
        this.changeDetection.detectChanges();
    }

    private generateChartAssistSeriesSet(
        myChart: IMyChart,
        dataSeriesCount: number,
        index: number
    ): IChartAssistSeries<IAccessors>[] {
        const timeLineSeriesSet = this.generateDataSeriesSet(
            dataSeriesCount,
            index
        );

        return timeLineSeriesSet.map((dataSeries) => ({
            ...dataSeries,
            scales: myChart.scales,
            renderer: myChart.renderer,
            accessors: myChart.accessors,
            showInLegend: true,
        }));
    }

    private generateDataSeriesSet(dataSeriesCount: number, chartIndex: number) {
        const chartNumber = chartIndex + 1;
        return Array.from(Array(dataSeriesCount).keys()).map((i) => {
            const seriesNumber = i + 1;
            return {
                id: `series-${chartNumber}-${seriesNumber}`,
                name: `Series ${chartNumber}-${seriesNumber}`,
                data: DataGenerator.mockTimeLineData(seriesNumber * 10),
            };
        });
    }
}
