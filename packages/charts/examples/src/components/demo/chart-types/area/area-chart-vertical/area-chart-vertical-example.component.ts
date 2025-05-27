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
    AreaAccessors,
    AreaRenderer,
    Chart,
    IAreaAccessors,
    IChartSeries,
    IXYScales,
    LinearScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "area-chart-vertical-example",
    templateUrl: "./area-chart-vertical-example.component.html",
    styleUrls: ["./area-chart-vertical-example.component.less"],
})
export class AreaChartVerticalExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit(): void {
        const gridConfig = new XYGridConfig();
        // Disable interaction because we don't support a horizontal interaction line yet
        gridConfig.interactionPlugins = false;
        gridConfig.axis.left.gridTicks = false;
        gridConfig.axis.left.tickSize = 0;
        gridConfig.axis.bottom.gridTicks = true;
        gridConfig.axis.left.fit = true;
        gridConfig.axis.bottom.fit = true;
        gridConfig.axis.bottom.tickSize = 0;
        gridConfig.axis.left.tickSize = 5;
        gridConfig.dimension.padding.left = 2; // 2 for border
        gridConfig.borders.left.visible = true;
        gridConfig.borders.bottom.visible = false;

        this.chart = new Chart(new XYGrid(gridConfig));

        // Area accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors = new AreaAccessors();
        accessors.data.y = (d, i) => i;
        accessors.data.x0 = () => 0;
        accessors.data.x1 = (d) => d.value;

        // The area renderer will make the chart look like an area chart.
        const renderer = new AreaRenderer();

        // In case of a area chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };

        scales.x.fixDomain([0, 100]);

        // Here we assemble the complete chart series.
        const seriesSet: IChartSeries<IAreaAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors,
                renderer,
                scales,
            })
        );

        // Finally, pass the series set to the chart's update method
        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { value: 12 },
                { value: 65 },
                { value: 30 },
                { value: 40 },
                { value: 90 },
                { value: 23 },
                { value: 12 },
            ],
        },
    ];
}
