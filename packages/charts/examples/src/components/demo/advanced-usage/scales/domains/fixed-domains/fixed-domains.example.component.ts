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
    IScale,
    LineAccessors,
    LinearScale,
    LineRenderer,
    Scales,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-chart-fixed-domains-example",
    templateUrl: "./fixed-domains.example.component.html",
})
export class FixedDomainsExampleComponent implements OnInit {
    public xScale: IScale<Date> = new TimeScale();
    public yScale: IScale<number> = new LinearScale();

    public chart: Chart;
    private seriesSet: IChartSeries<ILineAccessors>[];
    private format = "YYYY-MM-DDTHH:mm:ssZ";

    public ngOnInit(): void {
        const scales: Scales = {
            x: this.xScale,
            y: this.yScale,
        };

        // Default domain calculator
        // scales.y.domainCalculator = getAutomaticDomain;

        const gridConfig = new XYGridConfig();
        gridConfig.axis.bottom.fit = true;
        this.chart = new Chart(new XYGrid(gridConfig));

        this.seriesSet = getData(this.format).map((d) => ({
            ...d,
            scales,
            accessors: new LineAccessors(),
            renderer: new LineRenderer(),
        }));

        this.chart.update(this.seriesSet);
        this.chart.updateDimensions();
    }

    public fixXDomain(): void {
        const startDatetime = moment(
            "2016-12-29T06:00:00.000Z",
            this.format
        ).toDate();
        const endDatetime = moment(
            "2017-01-04T06:00:00.000Z",
            this.format
        ).toDate();

        this.xScale.fixDomain([startDatetime, endDatetime]);
        this.chart.update(this.seriesSet);
    }

    public fixYDomain(): void {
        this.yScale.fixDomain([0, 100]);
        this.chart.update(this.seriesSet);
    }

    public resetDomains(): void {
        this.xScale.isDomainFixed = false;
        this.yScale.isDomainFixed = false;
        this.chart.update(this.seriesSet);
    }
}

/* Chart data */
function getData(format: string) {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 30 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 95 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 45 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 60 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 35 },
            ],
        },
    ];
}
