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
    XYGrid,
} from "@nova-ui/charts";

enum Status {
    Error = "error",
    Warning = "warning",
}

@Component({
    selector: "nui-thresholds-basic-example",
    templateUrl: "./thresholds-basic.example.component.html",
})
export class ThresholdsBasicExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public chartAssist = new ChartAssist(this.chart);

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
            // The example highlights time intervals defined by data points because of the type of scale that's used.
            // All that's necessary to achieve status zones defined by data lines intersecting with threshold zones is
            // to change the scale type to a continuous time scale by changing the 'x' scale definition to:
            // x: new TimeScale(),
            y: new LinearScale(),
        };

        // Set the left scale ID on the chart's grid to let it know which scale to use for the left axis ticks
        (this.chart.getGrid() as XYGrid).leftScaleId = scales.y.id;

        // Backgrounds use the StatusBarRenderer which requires a special set of scales.
        // Note that the x scale is shared between the foreground series and the background series.
        // Also note that the y band scale fixes the domain to a single value of STATUS_DOMAIN
        const bgScales: IXYScales = {
            x: scales.x,
            y: new BandScale().fixDomain(StatusAccessors.STATUS_DOMAIN),
        };

        // Zone definitions tell the threshold service where threshold zones begin and end
        const zoneDefinitions: ISimpleThresholdZone[] = getZoneDefinitions();
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
            // In this case, we're creating backgrounds, side indicators, and threshold lines.
            // ---
            // *Note:* The order in which these elements are rendered on the chart corresponds to the order in which
            // the elements are defined here. So, in this case, since the threshold lines are defined after the
            // backgrounds in this array, the threshold lines will be rendered in front of the backgrounds on the chart.
            const seriesThresholds = [
                this.thresholdsService.getBackgrounds(
                    s,
                    zones,
                    bgScales,
                    this.thresholdsPalette.backgroundColors
                ),
                ...this.thresholdsService.getThresholdLines(zones),
                ...this.thresholdsService.getSideIndicators(zones, scales),
            ];

            thresholds.push(...seriesThresholds);
        }

        // Invoke the update method on the chart assist passing the appropriate series sets
        // ---
        // *Note:* The order in which these series sets are rendered on the chart corresponds to the order in which the series are
        // passed here. So, in this case, since the 'seriesSet' appears after the 'thresholds' in this array, the main data elements
        // will be rendered in front of the threshold-related elements on the chart.
        this.chartAssist.update([...thresholds, ...seriesSet]);
    }
}

/* Chart data */
function getZoneDefinitions() {
    return [
        { status: Status.Error, start: 90 },
        { status: Status.Error, end: 10 },
        { status: Status.Warning, start: 70, end: 90 },
        { status: Status.Warning, start: 10, end: 30 },
    ];
}

function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2016-12-25T15:05:00Z", format).toDate(), y: 30 },
                { x: moment("2016-12-25T15:10:00Z", format).toDate(), y: 95 },
                { x: moment("2016-12-25T15:15:00Z", format).toDate(), y: 15 },
                { x: moment("2016-12-25T15:20:00Z", format).toDate(), y: 60 },
                { x: moment("2016-12-25T15:25:00Z", format).toDate(), y: 35 },
                { x: moment("2016-12-25T15:30:00Z", format).toDate(), y: 5 },
                { x: moment("2016-12-25T15:35:00Z", format).toDate(), y: 60 },
                { x: moment("2016-12-25T15:40:00Z", format).toDate(), y: 84 },
                { x: moment("2016-12-25T15:55:00Z", format).toDate(), y: 86 },
                { x: moment("2016-12-25T16:00:00Z", format).toDate(), y: 35 },
            ],
        },
    ];
}
