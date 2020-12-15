import { ITimeframe } from "@nova-ui/bits";
import moment from "moment/moment";

import { ITimeseriesWidgetData } from "../../types";

/**
 * Use this function to apply endpoints on status data returned by a data source so that when the status
 * chart is zoomed (filtered), each status visualization is ensured to have valid start and end values
 *
 * @param timeframeFilter The timeframe used for filtering the data
 * @param filteredData The data after the filter is applied
 * @param originalData The superset of data with no filter applied
 *
 * @returns The filtered data including start and end data points applied to each series
 */
export function applyStatusEndpoints(timeframeFilter: ITimeframe,
                                     filteredData: ITimeseriesWidgetData[],
                                     originalData: ITimeseriesWidgetData[]): ITimeseriesWidgetData[] {
    const filteredDataWithEndpoints = filteredData;
    originalData.forEach((d: ITimeseriesWidgetData, i: number) => {
        if (d.data.length === 0) {
            return;
        }

        let startIndex = -1;
        let endIndex = -1;

        const fd = filteredData[i].data;
        if (fd.length > 0) {
            // if we have filtered data, get the start and end indexes from the original unfiltered data
            startIndex = d.data.findIndex(datum => moment(datum.x).isSame(fd[0].x));
            endIndex = d.data.findIndex(datum => moment(datum.x).isSame(fd[fd.length - 1].x));
        } else {
            // if the filter doesn't overlap any data points, use the indexes of the first data points
            // in the original data that come after the start and before end filter date times respectively
            startIndex = d.data.findIndex(datum => moment(datum.x).isAfter(timeframeFilter.startDatetime));
            endIndex = d.data.findIndex(datum => moment(datum.x).isAfter(timeframeFilter.endDatetime)) - 1;
        }

        const filterStartMoment = moment(timeframeFilter.startDatetime);
        if ((fd.length === 0 || !filterStartMoment.isSame(fd[0].x)) && filterStartMoment.isBetween(d.data[0].x, d.data[d.data.length - 1].x)) {
            filteredDataWithEndpoints[i].data.unshift({ ...d.data[startIndex - 1], x: timeframeFilter.startDatetime.toDate() });
        }

        const filterEndMoment = moment(timeframeFilter.endDatetime);
        if ((fd.length === 0 || !filterEndMoment.isSame(fd[fd.length - 1].x)) && filterEndMoment.isBetween(d.data[0].x, d.data[d.data.length - 1].x)) {
            filteredDataWithEndpoints[i].data.push({ ...d.data[endIndex], x: timeframeFilter.endDatetime.toDate() });
        }
    });

    return filteredDataWithEndpoints;
}
