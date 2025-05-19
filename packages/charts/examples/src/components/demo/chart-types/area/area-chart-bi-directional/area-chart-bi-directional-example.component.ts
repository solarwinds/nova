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
    AreaAccessors,
    areaGrid,
    AreaRenderer,
    Chart,
    ChartAssist,
    IAreaAccessors,
    IChartSeries,
    IXYScales,
    LinearScale,
    TimeScale,
} from "@nova-ui/charts";

@Component({
    selector: "area-chart-bi-directional-example",
    templateUrl: "./area-chart-bi-directional-example.component.html",
})
export class AreaChartBiDirectionalExampleComponent implements OnInit {
    public chart: Chart;
    public chartAssist: ChartAssist;

    public ngOnInit(): void {
        // areaGrid returns an XYGrid configured for displaying an area chart's axes and other grid elements.
        this.chart = new Chart(areaGrid());
        // ChartAssist helps with synchronizing hover events between the chart and the legend
        this.chartAssist = new ChartAssist(this.chart);

        // Area accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors1 = new AreaAccessors();
        // 'x' defines access for values in the data that correspond to the horizontal axis
        accessors1.data.x = (d) => d.timeStamp;
        // 'y0' defines the baseline, in other words, where the area starts
        accessors1.data.y0 = () => 0;
        // 'y1' defines access to the numeric values we want to visualize, in other words, where the area ends
        accessors1.data.y1 = (d) => d.value;
        // 'x' and 'y' accessors define the position of the marker. 'x' was already defined, so now we need to define 'y' as well.
        // Notice that the 'y' is assigned the 'absoluteY1' accessor which takes into account areas that may be stacked below
        // the current area and retrieves the absolute distance from the baseline to the area's value line.
        accessors1.data.y = accessors1.data.absoluteY1;
        // Even though we're using different accessor instances for each series, we want to use the same marker
        // accessor so that each series is assigned a different marker shape from the same marker sequence.
        // Take a look also at the marker assignment for the second accessors instance below.
        accessors1.series.marker = this.chartAssist.markers.get;

        /**
         * This second AreaAccessors instance flips the sign of the value so that
         * the area is displayed below the baseline.
         */
        const accessors2 = new AreaAccessors();
        accessors2.data.x = (d) => d.timeStamp;
        accessors2.data.y0 = () => 0;
        // Here's where we flip the sign of the value so that the area is displayed below the baseline
        accessors2.data.y1 = (d) => -d.value;
        // Both series use the same color accessor so that the second series will use the second color in the sequence
        accessors2.series.color = accessors1.series.color;
        // 'y' defines the position of the marker
        accessors2.data.y = accessors2.data.absoluteY1;
        // Even though we're using different accessor instances for each series, we want to use the same marker
        // accessor so that each series is assigned a different marker shape from the same marker sequence.
        accessors2.series.marker = this.chartAssist.markers.get;

        // The area renderer will make the chart look like an area chart.
        const renderer = new AreaRenderer();

        // In case of an area chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        /**
         * This tick formatter will format values on the left axis as positive both above and baseline as
         * well as in the legend. For legend setup, see 'chartAssist.getHighlightedValue' usage in the
         * template file.
         */
        scales.y.formatters.tick = (value: number) => `${Math.abs(value)}`;

        // Fixing the domain is optional.
        scales.y.fixDomain([-100, 100]);

        // Here we assemble the complete chart series.
        const seriesSet: Partial<IChartSeries<IAreaAccessors>>[] =
            getData().map((d) => ({
                ...d,
                renderer,
                scales,
            }));

        // In this case, each series has its own accessors instance.
        seriesSet[0].accessors = accessors1;
        seriesSet[1].accessors = accessors2;

        // Finally, pass the series set to the chart's update method.
        this.chartAssist.update(seriesSet as IChartSeries<IAreaAccessors>[]);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "up",
            name: "Up Speed",
            data: [
                {
                    timeStamp: moment("2016-12-25T11:45:29.909Z", format),
                    value: 6,
                },
                {
                    timeStamp: moment("2016-12-25T12:10:29.909Z", format),
                    value: 33,
                },
                {
                    timeStamp: moment("2016-12-25T12:50:29.909Z", format),
                    value: 15,
                },
                {
                    timeStamp: moment("2016-12-25T13:15:29.909Z", format),
                    value: 20,
                },
                {
                    timeStamp: moment("2016-12-25T13:40:29.909Z", format),
                    value: 30,
                },
                {
                    timeStamp: moment("2016-12-25T13:55:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T14:20:29.909Z", format),
                    value: 6,
                },
                {
                    timeStamp: moment("2016-12-25T14:40:29.909Z", format),
                    value: 35,
                },
                {
                    timeStamp: moment("2016-12-25T15:00:29.909Z", format),
                    value: 23,
                },
                {
                    timeStamp: moment("2016-12-25T15:25:29.909Z", format),
                    value: 25,
                },
                {
                    timeStamp: moment("2016-12-25T15:45:29.909Z", format),
                    value: 38,
                },
                {
                    timeStamp: moment("2016-12-25T16:10:29.909Z", format),
                    value: 25,
                },
                {
                    timeStamp: moment("2016-12-25T16:30:29.909Z", format),
                    value: 43,
                },
                {
                    timeStamp: moment("2016-12-25T16:45:29.909Z", format),
                    value: 28,
                },
            ],
        },
        {
            id: "down",
            name: "Dn Speed",
            data: [
                {
                    timeStamp: moment("2016-12-25T11:45:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T12:10:29.909Z", format),
                    value: 65,
                },
                {
                    timeStamp: moment("2016-12-25T12:50:29.909Z", format),
                    value: 30,
                },
                {
                    timeStamp: moment("2016-12-25T13:15:29.909Z", format),
                    value: 40,
                },
                {
                    timeStamp: moment("2016-12-25T13:40:29.909Z", format),
                    value: 60,
                },
                {
                    timeStamp: moment("2016-12-25T13:55:29.909Z", format),
                    value: 23,
                },
                {
                    timeStamp: moment("2016-12-25T14:20:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T14:40:29.909Z", format),
                    value: 70,
                },
                {
                    timeStamp: moment("2016-12-25T15:00:29.909Z", format),
                    value: 45,
                },
                {
                    timeStamp: moment("2016-12-25T15:25:29.909Z", format),
                    value: 50,
                },
                {
                    timeStamp: moment("2016-12-25T15:45:29.909Z", format),
                    value: 75,
                },
                {
                    timeStamp: moment("2016-12-25T16:10:29.909Z", format),
                    value: 50,
                },
                {
                    timeStamp: moment("2016-12-25T16:30:29.909Z", format),
                    value: 85,
                },
                {
                    timeStamp: moment("2016-12-25T16:45:29.909Z", format),
                    value: 55,
                },
            ],
        },
    ];
}
