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
    BandScale,
    barAccessors,
    barGrid,
    BarRenderer,
    Chart,
    getAutomaticDomainWithIncludedInterval,
    IAccessors,
    IChartSeries,
    LinearScale,
    NoopAccessors,
    NoopRenderer,
    NoopScale,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-time-scale-example",
    templateUrl: "./bar-chart-time-scale.example.component.html",
})
export class BarChartTimeScaleExampleComponent implements OnInit {
    public chart = new Chart(barGrid());

    ngOnInit() {
        const accessors = barAccessors();
        const renderer = new BarRenderer();

        const bandScale = new BandScale();
        const linearScale = new LinearScale();
        linearScale.domainCalculator = getAutomaticDomainWithIncludedInterval([
            0, 0,
        ]);
        const scales: any = {
            x: bandScale,
            y: linearScale,
        };

        const start = moment([2018, 7, 4]);
        const seriesSet = getData(start).map(
            (d): IChartSeries<IAccessors> => ({
                ...d,
                accessors,
                renderer,
                scales,
            })
        );

        bandScale.fixDomain(seriesSet.map((s) => s.data[0].category));

        const scaleId = "bottom";
        const time = new TimeScale(scaleId);
        const end = start.clone().add(seriesSet.length, "hour");
        time.fixDomain([start.clone().toDate(), end.toDate()]);

        // This is the most crucial part: users need to add "fake" series, so framework would be able to use provided time scale.
        // You need to provide scale for x or y and provide the id (for bottom or left scale). Id must be the same as the one used to create scale.
        // We suggest using Noops (render, accessor, other scale) for this fake series.
        seriesSet.push({
            id: "0",
            name: "hidden",
            data: [],
            accessors: new NoopAccessors(),
            renderer: new NoopRenderer(),
            scales: {
                x: time,
                y: new NoopScale(),
            },
        });
        (this.chart.getGrid() as XYGrid).bottomScaleId = scaleId;

        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData(start: Moment) {
    const values = [66, 14, 5, 40, 3, 23, 15];

    const dataSet = [];
    for (let i = 0; i < values.length; i++) {
        const date = start.clone().add(i, "hour");
        dataSet.push({
            id: `id-${i}`,
            name: date.toString(),
            data: [
                {
                    value: values[i],
                    category: date.toString(),
                    ["__bar"]: {
                        start: 0,
                        end: values[i],
                    },
                },
            ],
        });
    }

    return dataSet;
}
