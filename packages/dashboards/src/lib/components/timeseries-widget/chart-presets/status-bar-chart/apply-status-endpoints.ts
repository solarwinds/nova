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

import moment from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";

import { ITimeseriesWidgetData } from "../../types";

/**
 * Use this function to apply endpoints on status data returned by a data source so that when the status
 * chart is zoomed (filtered), each status visualization is ensured to have valid start and end values
 *
 * @param timeframeFilter The timeframe used for filtering the data
 * @param filteredSeriesData The series data after the filter is applied
 * @param originalSeriesData The superset of series data with no filter applied
 *
 * @returns The filtered data including start and end data points applied to each series
 */
export function applyStatusEndpoints(
    timeframeFilter: ITimeframe,
    filteredSeriesData: ITimeseriesWidgetData[],
    originalSeriesData: ITimeseriesWidgetData[]
): ITimeseriesWidgetData[] {
    const filteredDataWithEndpoints = filteredSeriesData;
    originalSeriesData.forEach((series: ITimeseriesWidgetData, i: number) => {
        if (series.data.length === 0) {
            return;
        }

        let startIndex = -1;
        let endIndex = -1;

        const filteredData = filteredSeriesData[i].data;
        if (filteredData.length > 0) {
            // if we have filtered data, get the start and end indexes from the original unfiltered data
            startIndex = series.data.findIndex((datum) =>
                moment(datum.x).isSame(filteredData[0].x)
            );
            endIndex = series.data.findIndex((datum) =>
                moment(datum.x).isSame(filteredData[filteredData.length - 1].x)
            );
        } else {
            // if the filter doesn't overlap any data points, use the indexes of the first data points
            // in the original data that come after the start and before end filter date times respectively
            startIndex = series.data.findIndex((datum) =>
                moment(datum.x).isAfter(timeframeFilter.startDatetime)
            );
            endIndex =
                series.data.findIndex((datum) =>
                    moment(datum.x).isAfter(timeframeFilter.endDatetime)
                ) - 1;
        }

        const filterStartMoment = moment(timeframeFilter.startDatetime);
        if (
            (filteredData.length === 0 ||
                !filterStartMoment.isSame(filteredData[0].x)) &&
            filterStartMoment.isBetween(
                series.data[0].x,
                series.data[series.data.length - 1].x
            )
        ) {
            filteredDataWithEndpoints[i].data.unshift({
                ...series.data[startIndex - 1],
                x: timeframeFilter.startDatetime.toDate(),
            });
        }

        const filterEndMoment = moment(timeframeFilter.endDatetime);
        if (
            (filteredData.length === 0 ||
                !filterEndMoment.isSame(
                    filteredData[filteredData.length - 1].x
                )) &&
            filterEndMoment.isBetween(
                series.data[0].x,
                series.data[series.data.length - 1].x
            )
        ) {
            filteredDataWithEndpoints[i].data.push({
                ...series.data[endIndex],
                x: timeframeFilter.endDatetime.toDate(),
            });
        }
    });

    return filteredDataWithEndpoints;
}
