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
import { rgb } from "d3-color";
import get from "lodash/get";
import moment, { Duration, Moment } from "moment/moment";

import {
    BandScale,
    CHART_MARKERS,
    CHART_PALETTE_CS1,
    CHART_PALETTE_CS_S_EXTENDED,
    getColorValueByName,
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    MappedValueProvider,
    SequentialChartMarkerProvider,
    SequentialColorProvider,
    SparkChartAssist,
    StatusAccessors,
    ThresholdsService,
    TimeScale,
} from "@nova-ui/charts";

enum Status {
    Error = "error",
    Warning = "warning",
}

@Component({
    selector: "nui-thresholds-spark-example",
    templateUrl: "./thresholds-spark.example.component.html",
})
export class ThresholdsSparkExampleComponent implements OnInit {
    public chartAssist: SparkChartAssist;
    public statusBgColors = new MappedValueProvider(
        {
            [Status.Error]: addOpacity(CHART_PALETTE_CS_S_EXTENDED[2], 0.2),
            [Status.Warning]: addOpacity(CHART_PALETTE_CS_S_EXTENDED[4], 0.3),
        },
        "transparent"
    );
    public statusIcons = {
        [Status.Error]: "status_critical",
        [Status.Warning]: "status_warning",
    };

    private renderer: LineRenderer;
    private accessors: LineAccessors;
    private xScale = new TimeScale();

    constructor(private thresholdsService: ThresholdsService) {}

    public ngOnInit(): void {
        this.chartAssist = new SparkChartAssist();
        this.renderer = new LineRenderer();
        this.accessors = new LineAccessors(
            new SequentialColorProvider([CHART_PALETTE_CS1[0]]),
            new SequentialChartMarkerProvider([CHART_MARKERS[0]])
        );
        this.accessors.data.status = (d) => get(d, "__thresholds.status");

        const seriesSet: IChartSeries<ILineAccessors>[] = getLineSeries(
            this.xScale,
            this.renderer,
            this.accessors
        );

        // Zone definitions tell the threshold service where threshold zones begin and end
        const zoneDefinitions = getZoneDefinitions();

        const sparks = seriesSet.map((s) => {
            // It's possible to manually define zones by area-like data series with start/end values for every data point. We don't do that
            // here, but what we do instead is use simplified zones that are defined by a start value and/or an end value. (A missing
            // start or end value indicates an infinite zone.)
            // Those values are then converted into a set of data series in this step.
            const zones = this.thresholdsService.getThresholdZones(
                s,
                zoneDefinitions,
                this.statusBgColors
            );

            // Backgrounds use the StatusBarRenderer which requires a special set of scales.
            // Note that the x scale is shared between the foreground series and the background series.
            // Also note that the y band scale fixes the domain to a single value of STATUS_DOMAIN
            const bgScales = {
                x: s.scales.x,
                y: new BandScale().fixDomain(StatusAccessors.STATUS_DOMAIN),
            };

            // This injects threshold data into every data point of the source series. It is important, because later we can
            // access related threshold information from many different places such as the legend.
            this.thresholdsService.injectThresholdsData(s, zones);
            // We can use the thresholds service to create the background series for each spark
            const backgrounds = this.thresholdsService.getBackgrounds(
                s,
                zones,
                bgScales,
                this.statusBgColors
            );

            return {
                id: s.id,
                chartSeriesSet: [s, backgrounds],
            };
        });

        this.chartAssist.updateSparks(sparks);
    }
}

/* Chart data */
function getZoneDefinitions() {
    return [
        { status: Status.Error, start: 90 },
        { status: Status.Warning, start: 70, end: 90 },
    ];
}

function getLineSeries(
    xScale: TimeScale,
    renderer: LineRenderer,
    accessors: LineAccessors
): IChartSeries<ILineAccessors>[] {
    const baseDate = moment([2016, 11, 25]);
    const interval = moment.duration(1, "hours");
    const series = [
        {
            id: "shared-pool-size",
            name: "Shared pool size",
            units: "MB",
            values: [
                67, 16, 3, 56, 26, 68, 74, 45, 54, 81, 13, 90, 72, 61, 97, 32,
                64, 22, 60, 11, 53, 77, 88, 49, 66,
            ],
        },
        {
            id: "buffer-cache-size",
            name: "Buffer cache size",
            units: "MB",
            values: [
                5, 15, 52, 75, 64, 74, 6, 24, 100, 26, 91, 38, 4, 45, 93, 44,
                59, 48, 99, 96, 53, 72, 32, 69, 27,
            ],
        },
        {
            id: "pga-cache-size",
            name: "PGA cache size",
            units: "MB",
            values: [
                83, 21, 43, 8, 96, 100, 5, 53, 14, 20, 82, 23, 29, 62, 33, 34,
                94, 72, 77, 45, 81, 80, 19, 26, 86,
            ],
        },
        {
            id: "db-logical-read-rate",
            name: "DB logical read rate",
            units: "%",
            values: [
                74, 9, 10, 87, 83, 41, 4, 96, 100, 33, 30, 26, 40, 12, 21, 3,
                69, 59, 32, 93, 62, 25, 90, 58, 51,
            ],
        },
        {
            id: "buffer-cache-hit-ratio",
            name: "Buffer cache hit ratio",
            units: "rps",
            values: [
                55, 78, 26, 35, 4, 37, 88, 64, 71, 40, 45, 9, 30, 51, 72, 44,
                75, 39, 67, 24, 19, 1, 59, 11, 25,
            ],
        },
        {
            id: "library-cache-hit-ratio",
            name: "Library cache hit ratio",
            units: "%",
            values: [
                71, 57, 1, 3, 23, 4, 79, 54, 10, 29, 36, 99, 34, 75, 94, 24, 26,
                50, 73, 64, 96, 12, 59, 95, 97,
            ],
        },
    ];

    return series.map((s) => ({
        ...s,
        data: getTimeData(s.values, baseDate, interval),
        scales: {
            x: xScale,
            y: new LinearScale(),
        },
        renderer,
        accessors,
    }));
}

function getTimeData(
    values: number[],
    baseDate: Moment,
    interval: Duration
): { x: Moment; y: number }[] {
    return values.map((v, i) => ({
        x: baseDate.clone().add(moment.duration(i * interval.asMilliseconds())),
        y: v,
    }));
}

function addOpacity(c: string, opacity: number): string {
    const color = getColorValueByName(c);
    const rgbColor = rgb(color);
    rgbColor.opacity = opacity;
    return rgbColor.toString();
}
