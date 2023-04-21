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
import moment, { duration } from "moment/moment";

import {
    BandScale,
    Chart,
    ChartAssist,
    ChartPalette,
    CHART_PALETTE_CS_S_EXTENDED,
    IAccessors,
    IChartAssistSeries,
    IChartSeries,
    ILineAccessors,
    ISimpleThresholdZone,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    MappedValueProvider,
    StatusAccessors,
    ThresholdsService,
    TimeIntervalScale,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

enum Status {
    Error = "error",
    Warning = "warning",
}

@Component({
    templateUrl: "./thresholds-prototype.component.html",
})
export class ThresholdsPrototypeComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public reversedThresholdsChart = new Chart(new XYGrid());
    public chartAssist = new ChartAssist(this.chart);
    public reversedThresholdsChartAssist = new ChartAssist(
        this.reversedThresholdsChart
    );

    private thresholdsPalette = new ChartPalette(
        new MappedValueProvider({
            [Status.Error]: CHART_PALETTE_CS_S_EXTENDED[2],
            [Status.Warning]: CHART_PALETTE_CS_S_EXTENDED[4],
        })
    );

    constructor(private thresholdsService: ThresholdsService) {}

    public ngOnInit(): void {
        const accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );
        const renderer = new LineRenderer();
        const scales: IXYScales = {
            x: new TimeIntervalScale(duration(5, "minutes")),
            y: new LinearScale(),
        };
        scales.y.fixDomain([0, 100]);

        const reversedThresholdScales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };
        reversedThresholdScales.y.fixDomain([0, 100]);

        // Backgrounds use the StatusBarRenderer which requires a special set of scales.
        // Note that the x scale is shared between the foreground series and the background series.
        // Also note that the y band scale fixes the domain to a single value of STATUS_DOMAIN
        const bgScales: IXYScales = {
            x: scales.x,
            y: new BandScale().fixDomain(StatusAccessors.STATUS_DOMAIN),
        };

        const reversedThresholdBgScales: IXYScales = {
            x: reversedThresholdScales.x,
            y: new BandScale().fixDomain(StatusAccessors.STATUS_DOMAIN),
        };

        // Zone definitions tell the threshold service where threshold zones begin and end
        const zoneDefinitions: ISimpleThresholdZone[] = getZoneDefinitions();
        const reversedZoneDefinitions: ISimpleThresholdZone[] =
            getReversedZoneDefinitions();
        // Here we define the main data series on the chart which will be visualized as lines
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors,
                renderer,
                scales,
            })
        );

        const thresholds: IChartAssistSeries<IAccessors>[] = [];
        for (const s of seriesSet) {
            // It's possible to manually define zones by area-like data series with start/end values for every data point. We don't do that
            // here, but what we do instead is use simplified zones that are defined by a start value and/or an end value. (A missing
            // start or end value indicates an infinite zone.)
            // Those values are then converted into a set of data series in this step.
            const zones = this.thresholdsService.getThresholdZones(
                s,
                zoneDefinitions,
                this.thresholdsPalette.standardColors
            );

            // This injects threshold data into every data point of the source series. It is important, because later we can
            // access related threshold information from many different places like legend, tooltips or even when calculating
            // other threshold related data series, which we do in the following step.
            this.thresholdsService.injectThresholdsData(s, zones);

            // Here we create all threshold related visuals for this series. The methods on the thresholdService are broken down and
            // generate separate elements of the whole, because some situations only require, for example, the backgrounds to be applied.
            const seriesThresholds = [
                ...this.thresholdsService.getThresholdLines(zones),
                this.thresholdsService.getBackgrounds(
                    s,
                    zones,
                    bgScales,
                    this.thresholdsPalette.backgroundColors
                ),
            ];

            thresholds.push(...seriesThresholds);
        }

        const reversedThresholdsSeriesSet: IChartSeries<ILineAccessors>[] =
            getData().map((d) => ({
                ...d,
                accessors,
                renderer,
                scales: reversedThresholdScales,
            }));

        const reversedThresholds: IChartAssistSeries<IAccessors>[] = [];
        for (const s of reversedThresholdsSeriesSet) {
            const zones = this.thresholdsService.getThresholdZones(
                s,
                reversedZoneDefinitions,
                this.thresholdsPalette.standardColors
            );
            this.thresholdsService.injectThresholdsData(s, zones);
            const seriesThresholds = [
                ...this.thresholdsService.getThresholdLines(zones),
                this.thresholdsService.getBackgrounds(
                    s,
                    zones,
                    reversedThresholdBgScales,
                    this.thresholdsPalette.backgroundColors
                ),
            ];

            reversedThresholds.push(...seriesThresholds);
        }

        this.chartAssist.update([...thresholds, ...seriesSet]);
        this.reversedThresholdsChartAssist.update([
            ...reversedThresholds,
            ...reversedThresholdsSeriesSet,
        ]);
    }
}

/* Chart data */
function getZoneDefinitions() {
    return [
        { status: Status.Error, start: 70, end: 90 },
        { status: Status.Warning, start: 40, end: 70 },
    ];
}

function getReversedZoneDefinitions() {
    return [
        { status: Status.Error, end: 20 },
        { status: Status.Warning, start: 20, end: 40 },
    ];
}

function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2016-12-25T15:05:00Z", format).toDate(), y: 20 },
                { x: moment("2016-12-25T15:10:00Z", format).toDate(), y: 80 },
                { x: moment("2016-12-25T15:15:00Z", format).toDate(), y: 10 },
                { x: moment("2016-12-25T15:20:00Z", format).toDate(), y: 0 },
                { x: moment("2016-12-25T15:25:00Z", format).toDate(), y: 50 },
                { x: moment("2016-12-25T15:30:00Z", format).toDate(), y: 20 },
            ],
        },
    ];
}
