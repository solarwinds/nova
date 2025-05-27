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
    IAreaAccessors,
    IChartSeries,
    IXYScales,
    LinearScale,
    TimeScale,
} from "@nova-ui/charts";

@Component({
    selector: "area-chart-basic-example",
    templateUrl: "./area-chart-basic-example.component.html",
})
export class AreaChartBasicExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit(): void {
        // areaGrid returns an XYGrid configured for displaying an area chart's axes and other grid elements
        this.chart = new Chart(areaGrid());

        // Area accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors = new AreaAccessors();
        // 'x' defines access for values in the data that correspond to the horizontal axis
        accessors.data.x = (d) => d.timeStamp;
        // 'y0' defines the baseline, in other words, where the area starts
        accessors.data.y0 = () => 0;
        // 'y1' defines access to the numeric values we want to visualize, in other words, where the area ends
        accessors.data.y1 = (d) => d.value;
        // 'x' and 'y' accessors define the position of the marker. 'x' was already defined, so now we need to define 'y' as well.
        // Notice that the 'y' is assigned the 'absoluteY1' accessor which takes into account areas that may be stacked below
        // the current area and retrieves the absolute distance from the baseline to the area's value line.
        accessors.data.y = accessors.data.absoluteY1;

        // The area renderer will make the chart look like an area chart.
        const renderer = new AreaRenderer();

        // In case of a area chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        // Fixing the domain is optional.
        scales.y.fixDomain([0, 100]);

        // Here we assemble the complete chart series.
        const seriesSet: IChartSeries<IAreaAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors,
                renderer,
                scales,
            })
        );

        // Finally, pass the series set to the chart's update method.
        this.chart.update(seriesSet);
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
