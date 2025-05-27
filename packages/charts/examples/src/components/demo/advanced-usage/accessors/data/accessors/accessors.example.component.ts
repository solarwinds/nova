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
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    XYGrid,
} from "@nova-ui/charts";

interface IMyDataPoint {
    x: number;
    y: number;
    z: number;
}

@Component({
    selector: "nui-accessors-example",
    templateUrl: "./accessors.example.component.html",
})
export class RendererAccessorsExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public seriesSet: IChartSeries<ILineAccessors>[];

    public ngOnInit(): void {
        const renderer = new LineRenderer();
        const scales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };

        const data: IMyDataPoint[] = [
            { x: 1, y: 10, z: 0 },
            { x: 2, y: 30, z: 1 },
            { x: 3, y: 5, z: 2 },
            { x: 4, y: 20, z: 3 },
            { x: 5, y: 15, z: 4 },
        ];

        const customAccessors = new LineAccessors();
        // Customizing data accessors
        customAccessors.data = {
            x: (datum: IMyDataPoint) => datum.z,
            y: (datum: IMyDataPoint) => datum.y * 2,
        };

        this.seriesSet = [
            {
                id: "series-1",
                name: "Series 1",
                data,
                scales,
                renderer,
                accessors: new LineAccessors(), // using default LineAccessors
            },
            {
                id: "series-2",
                name: "Series 2",
                data,
                scales,
                renderer,
                accessors: customAccessors, // using customized LineAccessors
            },
        ];

        this.chart.update(this.seriesSet);
    }
}
