import { ITimeframe } from "@nova-ui/bits";
import moment, { Moment } from "moment/moment";

import {
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
} from "../../types";

import { applyStatusEndpoints } from "./apply-status-endpoints";

describe("applyStatusEndpoints", () => {
    let widgetData: ITimeseriesWidgetData[];
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
    data: ITimeseriesWidgetData[]
): ITimeseriesWidgetData[] {
    let filteredData = data;
    filteredData = filteredData.map((item: ITimeseriesWidgetData) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        data: item.data.filter((seriesData: ITimeseriesWidgetSeriesData) =>
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
