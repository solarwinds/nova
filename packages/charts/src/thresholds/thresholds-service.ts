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

import { Injectable } from "@angular/core";
import { Numeric } from "d3-array";
import cloneDeep from "lodash/cloneDeep";
import sortBy from "lodash/sortBy";
import unionWith from "lodash/unionWith";
import values from "lodash/values";

import { LoggerService } from "@nova-ui/bits";

import { isBandScale, Scales } from "../core/common/scales/types";
import {
    DataAccessor,
    IChartAssistSeries,
    IDataSeries,
    IPosition,
    IRendererConfig,
    IValueProvider,
    IZoneCrossPoint,
} from "../core/common/types";
import {
    AreaAccessors,
    IAreaAccessors,
} from "../renderers/area/area-accessors";
import { IStatusAccessors } from "../renderers/bar/accessors/status-accessors";
import { statusAccessors } from "../renderers/bar/accessors/status-accessors-fn";
import { BarRenderer } from "../renderers/bar/bar-renderer";
import { THRESHOLDS_MAIN_CHART_RENDERER_CONFIG } from "../renderers/constants";
import {
    ILineAccessors,
    LineAccessors,
} from "../renderers/line/line-accessors";
import { LineRenderer } from "../renderers/line/line-renderer";
import {
    ISideIndicatorAccessors,
    SideIndicatorAccessors,
    SideIndicatorRenderer,
} from "../renderers/side-indicator-renderer";
import { ISimpleThresholdZone, ZoneBoundary, ZoneCross } from "./types";

/**
 * This service provides functionality that facilitates the creation of thresholds related visual element on charts.
 */
@Injectable()
export class ThresholdsService {
    public static SERIES_ID_SUFFIX = "__thresholds-background";

    constructor(private loggerService: LoggerService) {}

    /**
     * Calculates the threshold "statuses" - from/to and what zone we're in. It is the first step that is required before the usage of other methods. Having
     * the threshold "statuses" assigned to each data point enables us to access the threshold information not only in other methods for threshold
     * calculation, but also in other places, like legend or tooltips.
     *
     * @param dataSeries source data series that will be enhanced with threshold metadata
     * @param zones zones defined as data series with IAreaAccessors
     */
    public injectThresholdsData(
        dataSeries: IDataSeries<ILineAccessors>,
        zones: IDataSeries<IAreaAccessors>[]
    ) {
        const zoneIndexes: Record<string, number> = {};
        zones.forEach((z) => (z.entered = false));

        for (let i = 0; i < dataSeries.data.length; i++) {
            const d = dataSeries.data[i];
            const x: Numeric = dataSeries.accessors.data.x(
                d,
                i,
                dataSeries.data,
                dataSeries
            );
            const y: Numeric = dataSeries.accessors.data.y(
                d,
                i,
                dataSeries.data,
                dataSeries
            );

            d.__thresholds = {};

            const zone = this.getZoneByXY(zones, zoneIndexes, x, y);
            if (zone) {
                zone.entered = true;
                d.__thresholds.status = zone.value;
            }
        }
    }

    /**
     * This method creates a background series for TimeInterval or continuous (currently only works with time) scale.
     * If the series is continuous it detects intersection of source line data with given threshold zones and generates start / end for status periods.
     * Otherwise it will use the start and the end of the band.
     *
     * The default value of the rendererConfig parameter is {@link THRESHOLDS_MAIN_CHART_RENDERER_CONFIG}. For a summary chart, usually a smaller status
     * chart positioned below a main chart, use {@link THRESHOLDS_SUMMARY_RENDERER_CONFIG}.
     *
     * @param sourceSeries The data series from which to derive a background visualization
     * @param zones Zones defined as data series with IAreaAccessors
     * @param scales The scales to be used for the background visualization
     * @param colorProvider A value provider for the colors to be used for each status
     * @param thicknessMap Map of status to number specifying a custom height per status for the background visualization.
     *                     If a status is not specified in the map, the default thickness is the full height of the rendering area.
     * @param rendererConfig The renderer's configuration
     */
    public getBackgrounds(
        sourceSeries: IDataSeries<ILineAccessors>,
        zones: IDataSeries<IAreaAccessors>[],
        scales: Scales,
        colorProvider: IValueProvider<string>,
        thicknessMap: Record<string, number> = {},
        rendererConfig: IRendererConfig = cloneDeep(
            THRESHOLDS_MAIN_CHART_RENDERER_CONFIG
        )
    ): IChartAssistSeries<IStatusAccessors> {
        if (
            sourceSeries.data.length > 0 &&
            typeof sourceSeries.data[0].__thresholds === "undefined"
        ) {
            this.loggerService.warn(
                "Thresholds metadata is not defined on provided data series",
                sourceSeries
            );
        }

        let data: any[];
        const accessors = statusAccessors(colorProvider);
        accessors.data.thickness = (d) => thicknessMap[d.status];
        if (isBandScale(scales.x)) {
            data = cloneDeep(sourceSeries.data);
            accessors.data.start = sourceSeries.accessors.data.x;
            accessors.data.end = sourceSeries.accessors.data.x;
            accessors.data.color = (d) =>
                d.__thresholds && d.__thresholds.status
                    ? colorProvider.get(d.__thresholds.status)
                    : "transparent";
            accessors.data.thickness = (d) =>
                thicknessMap[d.__thresholds.status];
        } else {
            data = this.getBackgroundsDataForContinuousScale(
                sourceSeries,
                zones
            );
        }
        return {
            id: sourceSeries.id + ThresholdsService.SERIES_ID_SUFFIX,
            data,
            accessors,
            scales,
            renderer: new BarRenderer(rendererConfig),
            showInLegend: false,
        };
    }

    /**
     * Calculates background data for continuous scale based on intersections between the source data and zone definitions.
     *
     * @param sourceSeries source data series from which to derive background data
     * @param zones zones defined as data series with IAreaAccessors
     */
    private getBackgroundsDataForContinuousScale(
        sourceSeries: IDataSeries<ILineAccessors>,
        zones: IDataSeries<IAreaAccessors>[]
    ) {
        const backgroundData: ZoneCross[] = [];
        const breakPoints = this.getBreakPoints(sourceSeries, zones);

        const zoneIndexes: Record<string, number> = {};
        for (let i = 0; i < breakPoints.length - 1; i++) {
            const p1 = breakPoints[i];
            const p2 = breakPoints[i + 1];

            if (!p1 || !p2) {
                throw new Error("p1 or p2 are undefined");
            }

            const midPoint: IPosition = {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            };

            const zone = this.getZoneByXY(
                zones,
                zoneIndexes,
                midPoint.x,
                midPoint.y
            );
            if (zone) {
                const lastBgPoint = backgroundData[backgroundData.length - 1];
                if (
                    lastBgPoint &&
                    lastBgPoint.end?.valueOf() === p1.x &&
                    lastBgPoint.status === zone.value
                ) {
                    // Extend previous data point instead of creating a new one
                    lastBgPoint.end = new Date(p2.x);
                } else {
                    backgroundData.push({
                        status: zone.value,
                        start: new Date(p1.x),
                        end: new Date(p2.x),
                    });
                }
            }
        }
        return backgroundData;
    }

    /**
     * Calculate all "interesting" points along the data series that will be important to calculate the threshold status changes
     *
     * @param sourceSeries source data series from which to derive the break points
     * @param zones zones defined as data series with IAreaAccessors
     */
    private getBreakPoints(
        sourceSeries: IDataSeries<ILineAccessors>,
        zones: IDataSeries<IAreaAccessors>[]
    ): (IZoneCrossPoint | undefined)[] {
        const sourceAccessors = sourceSeries.accessors.data;

        let breakPoints: (IZoneCrossPoint | undefined)[] = [];

        for (let i = 0; i < sourceSeries.data.length - 1; i++) {
            // take two subsequent data points
            const d1 = sourceSeries.data[i];
            const d2 = sourceSeries.data[i + 1];

            // calculate their positions
            const xy1: IZoneCrossPoint = {
                x: sourceAccessors
                    .x(d1, i, sourceSeries.data, sourceSeries)
                    .valueOf(),
                y: sourceAccessors
                    .y(d1, i, sourceSeries.data, sourceSeries)
                    .valueOf(),
            };
            const xy2: IZoneCrossPoint = {
                x: sourceAccessors
                    .x(d2, i + 1, sourceSeries.data, sourceSeries)
                    .valueOf(),
                y: sourceAccessors
                    .y(d2, i + 1, sourceSeries.data, sourceSeries)
                    .valueOf(),
            };

            // try every zone to see if it's limits intersect the line between our two data points
            for (let j = 0; j < zones.length; j++) {
                const zone = zones[j];

                // TODO: so far only works with constant thresholds
                const zoneStartY = zone.accessors.data.start?.(
                    zone.data[0],
                    0,
                    zone.data,
                    zone
                );
                const zoneEndY = zone.accessors.data.end?.(
                    zone.data[0],
                    0,
                    zone.data,
                    zone
                );

                const zoneCrossPoints: (IZoneCrossPoint | undefined)[] = [
                    zoneStartY,
                    zoneEndY,
                ]
                    .map((y) => this.getCrossPointWithY(xy1, xy2, y)) // calculate cross points for both limits
                    .filter((c) => c); // take only those that actually intersect

                [xy1, xy2].forEach((xy) => {
                    if (xy.y === zoneStartY || xy.y === zoneEndY) {
                        xy.isZoneEdge = true;
                    }
                });

                // add all crossPoints, dataPoints, but only those with unique "x" coordinate
                breakPoints = unionWith(
                    breakPoints,
                    zoneCrossPoints,
                    [xy1, xy2],
                    (a, b) => a?.x === b?.x && a?.isZoneEdge === b?.isZoneEdge
                );
            }
        }

        return sortBy(breakPoints, "x");
    }

    /**
     * Generates threshold zone series from simplified zone definition. Simplified definition provides only two numbers to define the zone interval.
     * Creating these series manually is also possible for dynamic threshold limits.
     *
     * @param sourceSeries source data series from which to derive the zones
     * @param simpleZones a collection of zones that are each defined by a start value and/or an end value. (A missing
     start or end value indicates an infinite zone.)
     * @param colorProvider A value provider for the colors to be used for each status
     */
    public getThresholdZones(
        sourceSeries: IDataSeries<ILineAccessors>,
        simpleZones: ISimpleThresholdZone[],
        colorProvider: IValueProvider<string>
    ): IDataSeries<IAreaAccessors>[] {
        const areaAccessors = new AreaAccessors();
        areaAccessors.data.start = (d) => d.start;
        areaAccessors.data.end = (d) => d.end;
        areaAccessors.series.color = (seriesId, series) =>
            colorProvider.get(series.value);

        return simpleZones.map((z, i) => ({
            id: sourceSeries.id + "__" + z.status + "-" + i,
            value: z.status,
            data: [{ start: z.start, end: z.end }],
            scales: sourceSeries.scales,
            accessors: areaAccessors,
        }));
    }

    /**
     * Creates data series representing threshold lines on the chart. Solves collision between zones, where multiple zones are using the same limit value.
     *
     * @param zones Zones defined as data series with IAreaAccessors
     */
    public getThresholdLines(
        zones: IDataSeries<IAreaAccessors>[]
    ): IChartAssistSeries<ILineAccessors>[] {
        if (-1 === zones.findIndex((z) => z.entered)) {
            return [];
        }

        // TODO: works only for static thresholds
        const limits: Record<
            number,
            {
                series: IDataSeries<IAreaAccessors>;
                accessor: DataAccessor;
                zoneBoundary: ZoneBoundary;
            }
        > = {};

        function addLimitEntry(
            accessor: DataAccessor,
            zone: IDataSeries<IAreaAccessors>,
            zoneBoundary: ZoneBoundary
        ) {
            const value = accessor(zone.data[0], 0, zone.data, zone);
            if (
                typeof value !== "undefined" &&
                typeof limits[value] === "undefined"
            ) {
                limits[value] = { series: zone, accessor, zoneBoundary };
            }
        }

        for (const z of zones) {
            if (z.accessors.data.start && z.accessors.data.end) {
                addLimitEntry(z.accessors.data.start, z, ZoneBoundary.Start);
                addLimitEntry(z.accessors.data.end, z, ZoneBoundary.End);
            }
        }

        return values(limits).map((limit) =>
            this.getThresholdLine(
                limit.series,
                limit.accessor,
                limit.zoneBoundary
            )
        );
    }

    /**
     * Creates a IChartAssistSeries that represents a threshold zone limit defined by given valueAccessor
     *
     * @param zone A zone defined as a data series with IAreaAccessors
     * @param valueAccessor Accessor for the threshold limit
     * @param zoneBoundary The zone boundary represented by the line. Default is ZoneBoundary.Start.
     */
    public getThresholdLine(
        zone: IDataSeries<IAreaAccessors>,
        valueAccessor: DataAccessor,
        zoneBoundary = ZoneBoundary.Start
    ): IChartAssistSeries<ILineAccessors> {
        const accessors = new LineAccessors();
        accessors.data.y = valueAccessor;
        accessors.series.color = zone.accessors.series.color;
        const renderer = new LineRenderer({
            interactive: false,
            strokeWidth: 1,
            strokeStyle: LineRenderer.getStrokeStyleDashed(1),
            stateStyles: cloneDeep(
                THRESHOLDS_MAIN_CHART_RENDERER_CONFIG.stateStyles
            ),
            ignoreForDomainCalculation: true,
        });

        return {
            id: `${zone.id}__${zoneBoundary}__threshold-line`,
            data: zone.data,
            value: zone.value,
            accessors,
            renderer,
            scales: zone.scales,
            showInLegend: false,
        };
    }

    /**
     * Calculates the point where the data series line will cross a threshold line using the two closest points for each
     *
     * @param {IPosition} dataFrom Data starting point
     * @param {IPosition} dataTo Data ending point
     * @param {IPosition} thresholdFrom Threshold starting point
     * @param {IPosition} thresholdTo Threshold ending point
     * @returns {IPosition} the position of the cross point or `null` if lines don't cross
     */
    public getCrossPoint(
        dataFrom: IPosition,
        dataTo: IPosition,
        thresholdFrom: IPosition,
        thresholdTo: IPosition
    ): IPosition | undefined {
        /* Inspired by https://stackoverflow.com/a/1968345 */
        const dataShift: IPosition = {
            x: dataTo.x - dataFrom.x,
            y: dataTo.y - dataFrom.y,
        };
        const thresholdShift: IPosition = {
            x: thresholdTo.x - thresholdFrom.x,
            y: thresholdTo.y - thresholdFrom.y,
        };
        const s =
            (-dataShift.y * (dataFrom.x - thresholdFrom.x) +
                dataShift.x * (dataFrom.y - thresholdFrom.y)) /
            (-thresholdShift.x * dataShift.y + dataShift.x * thresholdShift.y);
        const t =
            (thresholdShift.x * (dataFrom.y - thresholdFrom.y) -
                thresholdShift.y * (dataFrom.x - thresholdFrom.x)) /
            (-thresholdShift.x * dataShift.y + dataShift.x * thresholdShift.y);

        if (!(s >= 0 && s <= 1 && t >= 0 && t <= 1)) {
            // No cross point detected
            return undefined;
        }

        return {
            x: dataFrom.x + t * dataShift.x,
            y: dataFrom.y + t * dataShift.y,
        };
    }

    /**
     * Find the zone that is relevant for current input data point defined by x, y coordinates.
     * Keep increasing the index while the next x value of threshold zone is still less than input x
     *
     * @param zones Zones defined as data series with IAreaAccessors
     * @param zoneIndexes provided indexes keep the last used value for searching for the given x coordinate, so it is expected that provided data points
     * are ordered by x in ascending order.
     * @param x The x value of the zone
     * @param y The y value of the zone
     */
    private getZoneByXY(
        zones: IDataSeries<IAreaAccessors>[],
        zoneIndexes: Record<string, number>,
        x: Numeric,
        y: Numeric
    ) {
        for (const zone of zones) {
            if (!zoneIndexes[zone.id]) {
                zoneIndexes[zone.id] = 0;
            }

            const zoneIndex = this.moveZoneIndex(zoneIndexes[zone.id], zone, x);
            zoneIndexes[zone.id] = zoneIndex;

            const zoneDataPoint = zone.data[zoneIndex];

            const zDataAccessors = zone.accessors.data;
            const start = zDataAccessors.start?.(
                zoneDataPoint,
                zoneIndex,
                zone.data,
                zone
            );
            const end = zDataAccessors.end?.(
                zoneDataPoint,
                zoneIndex,
                zone.data,
                zone
            );

            // TODO: this is not going to work for dynamic thresholds, so still have some work to do here
            if (
                (typeof start === "undefined" || y >= start) &&
                (typeof end === "undefined" || y <= end)
            ) {
                return zone;
            }
        }
        return null;
    }

    private moveZoneIndex(
        zoneIndex: number,
        zone: IDataSeries<IAreaAccessors>,
        x: Numeric
    ) {
        while (
            zoneIndex < zone.data.length - 1 &&
            zone.accessors.data.x(
                zone.data[zoneIndex + 1],
                zoneIndex + 1,
                zone.data,
                zone
            ) < x
        ) {
            zoneIndex++;
        }
        return zoneIndex;
    }

    public getCrossPointWithY(
        dataFrom: IPosition,
        dataTo: IPosition,
        y: number
    ) {
        return this.getCrossPoint(
            dataFrom,
            dataTo,
            { x: dataFrom.x, y },
            { x: dataTo.x, y }
        );
    }

    /**
     * Creates side indicator data series for given threshold zones
     *
     * @param zones Zones defined as data series with IAreaAccessors
     * @param scales The scales to be used for the side indicators
     * @param rendererConfig Configuration for the renderer. Default is the exported constant 'THRESHOLDS_MAIN_CHART_RENDERER_CONFIG'
     */
    public getSideIndicators(
        zones: IDataSeries<IAreaAccessors>[],
        scales: Scales,
        rendererConfig?: IRendererConfig
    ): IChartAssistSeries<ISideIndicatorAccessors>[] {
        const sideIndicators: IChartAssistSeries<ISideIndicatorAccessors>[] =
            [];
        const renderer = new SideIndicatorRenderer(
            rendererConfig || cloneDeep(THRESHOLDS_MAIN_CHART_RENDERER_CONFIG)
        );
        const indicatorsActive = -1 !== zones.findIndex((z) => z.entered);
        for (const z of zones) {
            const sideIndicatorAccessors = new SideIndicatorAccessors();
            sideIndicatorAccessors.series = {
                start: () => z.accessors.data.start?.(z.data[0], 0, z.data, z),
                end: () => z.accessors.data.end?.(z.data[0], 0, z.data, z),
                activeColor: () => z.accessors.series.color?.(z.id, z),
            };

            const sideIndicator: IChartAssistSeries<ISideIndicatorAccessors> = {
                id: z.id + "__side-indicator",
                data: [{ active: indicatorsActive }],
                accessors: sideIndicatorAccessors,
                scales,
                renderer,
                showInLegend: false,
            };

            sideIndicators.push(sideIndicator);
        }

        return sideIndicators;
    }
}
