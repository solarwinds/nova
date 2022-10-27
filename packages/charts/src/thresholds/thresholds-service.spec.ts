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

import uniq from "lodash/uniq";
import moment from "moment/moment";

import { LoggerService } from "@nova-ui/bits";

import { SequentialColorProvider } from "../core/common/palette/sequential-color-provider";
import { LinearScale } from "../core/common/scales/linear-scale";
import { TimeScale } from "../core/common/scales/time-scale";
import { Scales } from "../core/common/scales/types";
import {
    DataAccessor,
    IChartSeries,
    IDataSeries,
    IZoneCrossPoint,
} from "../core/common/types";
import { IAreaAccessors } from "../renderers/area/area-accessors";
import {
    ILineAccessors,
    LineAccessors,
} from "../renderers/line/line-accessors";
import { LineRenderer } from "../renderers/line/line-renderer";
import { ThresholdsService } from "./thresholds-service";
import { ISimpleThresholdZone, ZoneBoundary } from "./types";

describe("thresholds service", () => {
    let thresholdsService: ThresholdsService;
    let scales: Scales;
    let sourceSeries: IChartSeries<ILineAccessors>;
    let zoneDefinitions: ISimpleThresholdZone[];
    let zones: IDataSeries<IAreaAccessors>[];
    const mockColorProvider = new SequentialColorProvider(["magenta"]);
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    beforeEach(() => {
        thresholdsService = new ThresholdsService(new LoggerService());
        scales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        const renderer = new LineRenderer();
        // providing chartAssist colors and markers to LineAccessors will share them with the line chart
        const accessors = new LineAccessors();

        sourceSeries = {
            id: "series-1",
            data: [
                { x: moment("2016-12-25T15:05:00Z", format).toDate(), y: 10 },
                { x: moment("2016-12-25T15:40:00Z", format).toDate(), y: 80 },
                { x: moment("2016-12-25T15:50:00Z", format).toDate(), y: 90 },
                { x: moment("2016-12-25T15:55:00Z", format).toDate(), y: 60 },
                { x: moment("2016-12-25T16:00:00Z", format).toDate(), y: 30 },
            ],
            scales,
            renderer,
            accessors,
        };

        zoneDefinitions = [
            { status: "error", start: 80 },
            { status: "warning", start: 60, end: 80 },
            { status: "ok", end: 20 },
            { status: "ok", start: 40, end: 60 },
        ];

        zones = thresholdsService.getThresholdZones(
            sourceSeries,
            zoneDefinitions,
            mockColorProvider
        );
    });

    describe("injectThresholdsData", () => {
        beforeEach(() => {
            thresholdsService.injectThresholdsData(sourceSeries, zones);
        });

        it("should inject __threshold objects into all data points", () => {
            for (const d of sourceSeries.data) {
                expect(d.__thresholds).toBeDefined();
            }
        });

        it("should mark entered zones as entered", () => {
            expect(zones.filter((z) => z.entered).length).toEqual(3);
        });

        it("should sort zones in priority order, so first definition wins", () => {
            const expectedValues = [
                "ok",
                "error" /* overlap of error and warning */,
                "error",
                "warning" /* overlap of ok and warning */,
                null,
            ];

            sourceSeries.data.forEach((d, i) => {
                expectedValues[i] == null
                    ? expect(d.__thresholds.status).toBeUndefined()
                    : expect(d.__thresholds.status).toEqual(expectedValues[i]);
            });
        });
    });

    describe("getBackgrounds", () => {
        beforeEach(() => {
            thresholdsService.injectThresholdsData(sourceSeries, zones);
        });

        it("generates background data series", () => {
            const backgrounds = thresholdsService.getBackgrounds(
                sourceSeries,
                zones,
                scales,
                new SequentialColorProvider(["magenta"])
            );
            const expectedStatuses = [
                "ok",
                "ok",
                "warning",
                "error",
                "warning",
                "ok",
            ];

            expect(backgrounds.data.map((d) => d.status)).toEqual(
                expectedStatuses
            );
        });
    });

    describe("getThresholdZones", () => {
        it("generates zones series from simplified zone definition", () => {
            const testZones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );

            expect(testZones.length).toBe(zoneDefinitions.length);

            for (let i = 0; i < zoneDefinitions.length; i++) {
                const def = zoneDefinitions[i];
                const zone = testZones[i];

                expect(zone.data.length).toBe(1);

                expect(zone.data[0].start).toEqual(def.start);
                expect(zone.data[0].end).toEqual(def.end);

                expect(zone.id.indexOf(sourceSeries.id + "__")).toEqual(0);
            }
        });
    });

    describe("getThresholdLines", () => {
        beforeEach(() => {
            sourceSeries.data = [
                { x: moment("2016-12-25T15:05:00Z", format).toDate(), y: 10 },
                { x: moment("2016-12-25T15:40:00Z", format).toDate(), y: 80 },
                { x: moment("2016-12-25T15:50:00Z", format).toDate(), y: 90 },
                { x: moment("2016-12-25T15:55:00Z", format).toDate(), y: 60 },
                { x: moment("2016-12-25T16:00:00Z", format).toDate(), y: 30 },
            ];
        });

        it("should generate a unique id for each threshold line series if the 'start' of one zone is not the same value as the 'end' of another", () => {
            zoneDefinitions = [
                { status: "error", start: 75, end: 90 },
                { status: "warning", start: 40, end: 70 },
            ];
            zones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );
            const testSeriesSet = thresholdsService.getThresholdLines(zones);

            expect(testSeriesSet.length).toEqual(
                uniq(testSeriesSet.map((series) => series.id)).length
            );
        });

        it("should generate a unique id for each threshold line series even if the 'start' of one zone is the same value as the 'end' of another", () => {
            zoneDefinitions = [
                { status: "error", start: 70, end: 90 },
                { status: "warning", start: 40, end: 70 },
            ];
            zones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );
            const testSeriesSet = thresholdsService.getThresholdLines(zones);

            expect(testSeriesSet.length).toEqual(
                uniq(testSeriesSet.map((series) => series.id)).length
            );
        });

        it("should result in no lines if no zones are entered", () => {
            zoneDefinitions = [
                { status: "error", start: 95 },
                { status: "warning", end: 5 },
            ];
            zones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );
            thresholdsService.injectThresholdsData(sourceSeries, zones);
            const testSeriesSet = thresholdsService.getThresholdLines(zones);

            expect(testSeriesSet.length).toEqual(0);
        });
    });

    describe("getSideIndicators", () => {
        beforeEach(() => {
            sourceSeries.data = [
                { x: moment("2016-12-25T15:05:00Z", format).toDate(), y: 10 },
                { x: moment("2016-12-25T15:40:00Z", format).toDate(), y: 80 },
                { x: moment("2016-12-25T15:50:00Z", format).toDate(), y: 90 },
                { x: moment("2016-12-25T15:55:00Z", format).toDate(), y: 60 },
                { x: moment("2016-12-25T16:00:00Z", format).toDate(), y: 30 },
            ];
        });

        it("should generate side indicators corresponding to the provided zones", () => {
            zoneDefinitions = [
                { status: "error", start: 75, end: 90 },
                { status: "warning", start: 40, end: 70 },
            ];
            zones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );
            const sideIndicators = thresholdsService.getSideIndicators(
                zones,
                scales
            );

            expect(sideIndicators.length).toEqual(zoneDefinitions.length);
        });

        it("should mark all side indicators as active if any zone is entered", () => {
            zoneDefinitions = [
                { status: "error", start: 75, end: 90 },
                { status: "warning", end: 5 },
            ];
            zones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );
            thresholdsService.injectThresholdsData(sourceSeries, zones);
            const sideIndicators = thresholdsService.getSideIndicators(
                zones,
                scales
            );

            expect(
                sideIndicators.filter((si) => si.data[0].active).length
            ).toEqual(zoneDefinitions.length);
        });

        it("should mark all side indicators as inactive if no zones are entered", () => {
            zoneDefinitions = [
                { status: "error", start: 95 },
                { status: "warning", end: 5 },
            ];
            zones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );
            thresholdsService.injectThresholdsData(sourceSeries, zones);
            const sideIndicators = thresholdsService.getSideIndicators(
                zones,
                scales
            );

            expect(
                sideIndicators.filter((si) => si.data[0].active).length
            ).toEqual(0);
        });
    });

    describe("getThresholdLine", () => {
        it("creates a threshold line from original data with given accessor", () => {
            const fiveAccessor: DataAccessor = () => 5;
            const thresholdLine = thresholdsService.getThresholdLine(
                zones[0],
                fiveAccessor
            );

            expect(thresholdLine.data).toEqual(zones[0].data);
            expect(thresholdLine.accessors.data.y).toEqual(fiveAccessor);
        });

        it("creates a threshold line series that includes the substring '__start__' in the id", () => {
            const fiveAccessor: DataAccessor = () => 5;
            const thresholdLine = thresholdsService.getThresholdLine(
                zones[0],
                fiveAccessor
            );

            expect(thresholdLine.id.indexOf("__start__") >= 0).toEqual(true);
        });

        it("creates a threshold line series that includes the substring '__end__' in the id", () => {
            const fiveAccessor: DataAccessor = () => 5;
            const thresholdLine = thresholdsService.getThresholdLine(
                zones[0],
                fiveAccessor,
                ZoneBoundary.End
            );

            expect(thresholdLine.id.indexOf("__end__") >= 0).toEqual(true);
        });

        it("ignores the threshold line for domain calculation (NUI-5262)", () => {
            const fiveAccessor: DataAccessor = () => 5;
            const thresholdLine = thresholdsService.getThresholdLine(
                zones[0],
                fiveAccessor,
                ZoneBoundary.End
            );

            expect(
                thresholdLine.renderer.config.ignoreForDomainCalculation
            ).toEqual(true);
        });
    });

    describe("getCrossPoint", () => {
        it("should return null when lines do not cross", () => {
            const d1 = { x: 0, y: 0 };
            const d2 = { x: 10, y: 0 };
            const t1 = { x: 0, y: 10 };
            const t2 = { x: 10, y: 10 };
            const crossPoint = thresholdsService.getCrossPoint(d1, d2, t1, t2);

            expect(crossPoint).toBeUndefined();
        });

        it("should calculate the cross point when lines cross", () => {
            const d1 = { x: 0, y: 0 };
            const d2 = { x: 10, y: 10 };
            const t1 = { x: 0, y: 4 };
            const t2 = { x: 10, y: 9 };
            const expectedCrossPoint = { x: 8, y: 8 };
            const crossPoint = thresholdsService.getCrossPoint(d1, d2, t1, t2);

            expect(crossPoint).toEqual(expectedCrossPoint);
        });

        it("is able to handle vertical lines", () => {
            const d1 = { x: 10, y: 0 };
            const d2 = { x: 10, y: 20 };
            const t1 = { x: 0, y: 10 };
            const t2 = { x: 20, y: 10 };
            const expectedCrossPoint = { x: 10, y: 10 };
            const crossPoint = thresholdsService.getCrossPoint(d1, d2, t1, t2);

            expect(crossPoint).toEqual(expectedCrossPoint);
        });
    });

    describe("getCrossPointWithY", () => {
        it("should return null when lines do not cross", () => {
            const d1 = { x: 0, y: 0 };
            const d2 = { x: 10, y: 0 };
            const y = 5;
            const crossPoint = thresholdsService.getCrossPointWithY(d1, d2, y);

            expect(crossPoint).toBeUndefined();
        });

        it("should calculate the cross point when lines cross", () => {
            const d1 = { x: 0, y: 0 };
            const d2 = { x: 10, y: 8 };
            const y = 5;
            const expectedCrossPoint = { x: 6.25, y };
            const crossPoint = thresholdsService.getCrossPointWithY(d1, d2, y);

            expect(crossPoint).toEqual(expectedCrossPoint);
        });
    });

    describe("getBreakPoints", () => {
        it("should return a breakPoint with isZoneEdge to true if the data point hits the edge of a threshold", () => {
            zoneDefinitions = [
                { status: "error", start: 80 },
                { status: "warning", start: 60, end: 80 },
            ];
            const testCases = [
                {
                    data: 10,
                    isZoneEdge: false,
                },
                {
                    data: 80,
                    isZoneEdge: true,
                },
                {
                    data: 90,
                    isZoneEdge: false,
                },
                {
                    data: 60,
                    isZoneEdge: true,
                },
                {
                    data: 30,
                    isZoneEdge: false,
                },
            ];
            zones = thresholdsService.getThresholdZones(
                sourceSeries,
                zoneDefinitions,
                mockColorProvider
            );
            const breakPoints = (thresholdsService as any).getBreakPoints(
                sourceSeries,
                zones
            );
            testCases.forEach((testCase) => {
                let isZoneEdge = false;
                breakPoints.forEach((breakPoint: IZoneCrossPoint) => {
                    if (
                        breakPoint.y === testCase.data &&
                        breakPoint.isZoneEdge === true
                    ) {
                        isZoneEdge = true;
                    }
                });
                expect(isZoneEdge).toEqual(testCase.isZoneEdge);
            });
        });
    });
});
