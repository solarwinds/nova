import { ITimeframe } from "@nova-ui/bits";
import moment from "moment/moment";

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
