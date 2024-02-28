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

import moment, { Moment } from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";

import {
    CartesianWidgetData,
    CartesianWidgetSeriesData,
} from "../../types";
import { applyStatusEndpoints } from "./apply-status-endpoints";

describe("applyStatusEndpoints", () => {
    let widgetData: CartesianWidgetData[];
    const frozenTime = moment("2020-11-06T00:00:00-06:00")
        .startOf("day")
        .toDate();

    beforeEach(() => {
        widgetData = [
            {
                id: "series-1",
                name: "Test Name",
                description: "Test Description",
                data: [
                    {
                        x: moment(frozenTime).subtract(9, "day").toDate(),
                        y: Status.Warning,
                    },
                    {
                        x: moment(frozenTime).subtract(6, "day").toDate(),
                        y: Status.Up,
                    },
                    {
                        x: moment(frozenTime).subtract(3, "day").toDate(),
                        y: Status.Critical,
                    },
                    { x: moment(frozenTime).toDate(), y: Status.Critical },
                ],
            },
        ];
    });

    it("should not add any extra endpoints if the filtered data is the same as the original data", () => {
        const testTimeframe = {
            startDatetime: moment(frozenTime).subtract(9, "day"),
            endDatetime: moment(frozenTime).subtract(0, "day"),
            selectedPresetId: undefined,
            title: undefined,
        };
        const filteredData = filterData(testTimeframe, widgetData);
        const testData = applyStatusEndpoints(
            testTimeframe,
            filteredData,
            widgetData
        );
        expect(testData).toEqual(widgetData);
    });

    it("should add endpoints if the filtered data is empty but the timeframe is within the unfiltered domain", () => {
        const testTimeframe = {
            startDatetime: moment(frozenTime).subtract(5, "day"),
            endDatetime: moment(frozenTime).subtract(4, "day"),
            selectedPresetId: undefined,
            title: undefined,
        };
        const filteredData = filterData(testTimeframe, widgetData);
        const dataWithEndpoints = applyStatusEndpoints(
            testTimeframe,
            filteredData,
            widgetData
        )[0].data;
        expect(dataWithEndpoints.length).toEqual(2);
        expect(dataWithEndpoints[0].x).toEqual(
            testTimeframe.startDatetime.toDate()
        );
        expect(dataWithEndpoints[0].y).toEqual(widgetData[0].data[1].y);
        expect(dataWithEndpoints[1].x).toEqual(
            testTimeframe.endDatetime.toDate()
        );
        expect(dataWithEndpoints[1].y).toEqual(widgetData[0].data[1].y);
    });

    it("should add endpoints if the filtered data contains a single data point", () => {
        const testTimeframe = {
            startDatetime: moment(frozenTime).subtract(7, "day"),
            endDatetime: moment(frozenTime).subtract(4, "day"),
            selectedPresetId: undefined,
            title: undefined,
        };
        const filteredData = filterData(testTimeframe, widgetData);
        const dataWithEndpoints = applyStatusEndpoints(
            testTimeframe,
            filteredData,
            widgetData
        )[0].data;
        expect(dataWithEndpoints.length).toEqual(3);
        expect(dataWithEndpoints[0].x).toEqual(
            testTimeframe.startDatetime.toDate()
        );
        expect(dataWithEndpoints[0].y).toEqual(widgetData[0].data[0].y);
        expect(dataWithEndpoints[1].x).toEqual(widgetData[0].data[1].x);
        expect(dataWithEndpoints[1].y).toEqual(widgetData[0].data[1].y);
        expect(dataWithEndpoints[2].x).toEqual(
            testTimeframe.endDatetime.toDate()
        );
        expect(dataWithEndpoints[2].y).toEqual(widgetData[0].data[1].y);
    });

    it("should add one endpoint to the beginning of the filtered data if the filtered data contains a the first data point in the original data set", () => {
        const testTimeframe = {
            startDatetime: moment(frozenTime).subtract(10, "day"),
            endDatetime: moment(frozenTime).subtract(8, "day"),
            selectedPresetId: undefined,
            title: undefined,
        };
        const filteredData = filterData(testTimeframe, widgetData);
        const dataWithEndpoints = applyStatusEndpoints(
            testTimeframe,
            filteredData,
            widgetData
        )[0].data;
        expect(dataWithEndpoints.length).toEqual(2);
        expect(dataWithEndpoints[0].x).toEqual(widgetData[0].data[0].x);
        expect(dataWithEndpoints[0].y).toEqual(widgetData[0].data[0].y);
        expect(dataWithEndpoints[1].x).toEqual(
            testTimeframe.endDatetime.toDate()
        );
        expect(dataWithEndpoints[1].y).toEqual(widgetData[0].data[0].y);
    });

    it("should add one endpoint to the beginning of the filtered data if the filtered data contains a the last data point in the original data set", () => {
        const testTimeframe = {
            startDatetime: moment(frozenTime).subtract(1, "day"),
            endDatetime: moment(frozenTime).add(8, "day"),
            selectedPresetId: undefined,
            title: undefined,
        };
        const filteredData = filterData(testTimeframe, widgetData);
        const dataWithEndpoints = applyStatusEndpoints(
            testTimeframe,
            filteredData,
            widgetData
        )[0].data;
        expect(dataWithEndpoints.length).toEqual(2);
        expect(dataWithEndpoints[0].x).toEqual(
            testTimeframe.startDatetime.toDate()
        );
        expect(dataWithEndpoints[0].y).toEqual(widgetData[0].data[3].y);
        expect(dataWithEndpoints[1].x).toEqual(widgetData[0].data[3].x);
        expect(dataWithEndpoints[1].y).toEqual(widgetData[0].data[3].y);
    });
});

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
}

function filterData(
    timeframe: ITimeframe,
    data: CartesianWidgetData[]
): CartesianWidgetData[] {
    let filteredData = data;
    filteredData = filteredData.map((item: CartesianWidgetData) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        data: item.data.filter((seriesData: CartesianWidgetSeriesData) =>
            filterDates(
                seriesData.x,
                timeframe.startDatetime,
                timeframe.endDatetime
            )
        ),
    }));

    return filteredData;
}

function filterDates(dateToCheck: Date, startDate: Moment, endDate: Moment) {
    const mom = moment(dateToCheck);
    return (
        mom.isBetween(startDate, endDate) ||
        mom.isSame(startDate) ||
        mom.isSame(endDate)
    );
}
