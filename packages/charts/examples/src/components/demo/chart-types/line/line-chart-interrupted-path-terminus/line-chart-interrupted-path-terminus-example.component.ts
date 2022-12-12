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
    ChartAssist,
    IChartAssistSeries,
    IChartSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    MissingDataLineRendererConfig,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "line-chart-interrupted-path-terminus-example",
    templateUrl:
        "./line-chart-interrupted-path-terminus-example.component.html",
})
export class LineChartInterruptedPathTerminusExampleComponent
    implements OnInit
{
    // XYGrid is used for rendering axes as well as other grid elements
    public chart = new Chart(new XYGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public ngOnInit(): void {
        // In case of a line chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        const incomingSeries = getData();

        // Here we assemble the complete chart series.
        const seriesSet: IChartAssistSeries<ILineAccessors>[] = [];

        // The line renderer will make the chart look like a line chart.
        const renderer = new LineRenderer();
        // Line accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );

        // Renderer for the missing dataSeries
        const rendererMissing = new LineRenderer(
            new MissingDataLineRendererConfig()
        );
        const accessorsMissing = new LineAccessors();
        // we need to store the original value of the `defined` accessor
        const origDefinedAccessor = accessorsMissing.data.defined;
        // we're calling the original accessor implementation, but inverting it's logic
        accessorsMissing.data.defined = (d, i, data, dataSeries) =>
            !origDefinedAccessor?.(d, i, data, dataSeries) ?? true;

        for (const s of incomingSeries) {
            const cs: IChartSeries<ILineAccessors> = {
                ...s,
                accessors,
                renderer,
                scales,
            };
            seriesSet.push(cs);

            // this series will be used to visualize the missing data points
            seriesSet.push({
                // this naming convention will connect these two series and their interaction will be synchronized
                id: s.id + "__missing",
                data: s.data,
                accessors: accessorsMissing,
                renderer: rendererMissing,
                scales,
                showInLegend: false, // we don't want to show this in the legend
            });
        }

        // Finally, pass the series set to the chart's update method
        this.chartAssist.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    x: moment("2016-12-25T15:14:29.909Z", format).toDate(),
                    y: 30,
                    defined: false,
                },
                {
                    x: moment("2016-12-27T15:14:29.909Z", format).toDate(),
                    y: 95,
                    defined: false,
                },
                {
                    x: moment("2016-12-27T15:14:29.909Z", format).toDate(),
                    y: 95,
                },
                {
                    x: moment("2016-12-28T15:14:29.909Z", format).toDate(),
                    y: 35,
                },
                {
                    x: moment("2016-12-31T15:14:29.909Z", format).toDate(),
                    y: 60,
                },
                {
                    x: moment("2017-01-03T15:14:29.909Z", format).toDate(),
                    y: 35,
                },
                {
                    x: moment("2017-01-04T15:14:29.909Z", format).toDate(),
                    y: 20,
                },
                {
                    x: moment("2017-01-04T15:14:29.909Z", format).toDate(),
                    y: 20,
                    defined: false,
                },
                {
                    x: moment("2017-01-05T15:14:29.909Z", format).toDate(),
                    y: 35,
                    defined: false,
                },
            ],
        },
    ];
}
