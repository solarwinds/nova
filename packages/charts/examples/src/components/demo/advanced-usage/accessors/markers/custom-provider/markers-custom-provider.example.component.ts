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
    Chart,
    CHART_MARKERS,
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    SequentialChartMarkerProvider,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-markers-custom-provider-example",
    templateUrl: "./markers-custom-provider.example.component.html",
})
export class RendererMarkersCustomProviderExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());

    public ngOnInit(): void {
        const scales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };

        const renderer = new LineRenderer();

        const accessors = new LineAccessors();
        // Defining custom marker set
        const customMarkerSet = [
            CHART_MARKERS[6],
            CHART_MARKERS[8],
            CHART_MARKERS[9],
        ];
        // Setting marker accessor to use new SequentialChartMarkerProvider with custom markers
        accessors.series.marker = new SequentialChartMarkerProvider(
            customMarkerSet
        ).get;

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                scales,
                renderer,
                accessors,
            })
        );

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
                { x: 1, y: 30 },
                { x: 2, y: 50 },
                { x: 3, y: 25 },
                { x: 4, y: 40 },
                { x: 5, y: 35 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: 1, y: 20 },
                { x: 2, y: 40 },
                { x: 3, y: 15 },
                { x: 4, y: 30 },
                { x: 5, y: 25 },
            ],
        },
        {
            id: "series-3",
            name: "Series 3",
            data: [
                { x: 1, y: 10 },
                { x: 2, y: 30 },
                { x: 3, y: 5 },
                { x: 4, y: 20 },
                { x: 5, y: 15 },
            ],
        },
    ];
}
