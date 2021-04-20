import { Component } from "@angular/core";
import { IAccessors, IDataSeries } from "@nova-ui/charts";
import moment, { duration } from "moment/moment";

@Component({
    templateUrl: "./dst-test-page.component.html",
})
export class DstTestPageComponent {
    public insideDstData = getInsideDstData();
    public outsideDstData = getOutsideDstData();
    public startDstOneMinuteData = getStartDstOneMinuteData();
    public startDstOneHourData = getStartDstOneHourData();
    public startDstTwoHourData = getStartDstTwoHourData();
    public startDstOneDayData = getStartDstOneDayData();
    public endDstOneMinuteData = getEndDstOneMinuteData();
    public endDstOneHourData = getEndDstOneHourData();
    public endDstTwoHourData = getEndDstTwoHourData();
    public endDstOneDayData = getEndDstOneDayData();
    public oneMinuteInterval = duration(1, "minute");
    public oneDayInterval = duration(1, "days");
    public oneHourInterval = duration(1, "hours");
    public twoHourInterval = duration(2, "hours");
}

function getStartDstOneMinuteData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2021-03-14T07:58:00.000Z", format).toDate(), y: 30 },
                { x: moment("2021-03-14T07:59:00.000Z", format).toDate(), y: 95 },
                { x: moment("2021-03-14T08:00:00.000Z", format).toDate(), y: 15 },
                { x: moment("2021-03-14T08:01:00.000Z", format).toDate(), y: 60 },
                { x: moment("2021-03-14T08:02:00.000Z", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getStartDstOneHourData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2021-03-14T06:00:00.000Z", format).toDate(), y: 30 },
                { x: moment("2021-03-14T07:00:00.000Z", format).toDate(), y: 95 },
                { x: moment("2021-03-14T08:00:00.000Z", format).toDate(), y: 15 },
                { x: moment("2021-03-14T09:00:00.000Z", format).toDate(), y: 60 },
                { x: moment("2021-03-14T10:00:00.000Z", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getStartDstTwoHourData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2021-03-14T04:00:00.000Z", format).toDate(), y: 30 },
                { x: moment("2021-03-14T06:00:00.000Z", format).toDate(), y: 95 },
                { x: moment("2021-03-14T08:00:00.000Z", format).toDate(), y: 15 },
                { x: moment("2021-03-14T10:00:00.000Z", format).toDate(), y: 60 },
                { x: moment("2021-03-14T12:00:00.000Z", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getStartDstOneDayData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2021-03-13T0", format).toDate(), y: 30 },
                { x: moment("2021-03-14T0", format).toDate(), y: 95 },
                { x: moment("2021-03-15T0", format).toDate(), y: 15 },
                { x: moment("2021-03-16T0", format).toDate(), y: 60 },
                { x: moment("2021-03-17T0", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstOneMinuteData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2020-11-01T06:58:00.000Z", format).toDate(), y: 30 },
                { x: moment("2020-11-01T06:59:00.000Z", format).toDate(), y: 95 },
                { x: moment("2020-11-01T07:00:00.000Z", format).toDate(), y: 15 },
                { x: moment("2020-11-01T07:01:00.000Z", format).toDate(), y: 60 },
                { x: moment("2020-11-01T07:02:00.000Z", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstOneHourData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2020-11-01T06:00:00.000Z", format).toDate(), y: 30 },
                { x: moment("2020-11-01T07:00:00.000Z", format).toDate(), y: 95 },
                { x: moment("2020-11-01T08:00:00.000Z", format).toDate(), y: 15 },
                { x: moment("2020-11-01T09:00:00.000Z", format).toDate(), y: 60 },
                { x: moment("2020-11-01T10:00:00.000Z", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstTwoHourData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2020-11-01T03:00:00.000Z", format).toDate(), y: 30 },
                { x: moment("2020-11-01T05:00:00.000Z", format).toDate(), y: 95 },
                { x: moment("2020-11-01T07:00:00.000Z", format).toDate(), y: 15 },
                { x: moment("2020-11-01T09:00:00.000Z", format).toDate(), y: 60 },
                { x: moment("2020-11-01T11:00:00.000Z", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstOneDayData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2020-10-31T0", format).toDate(), y: 30 },
                { x: moment("2020-11-01T0", format).toDate(), y: 95 },
                { x: moment("2020-11-02T0", format).toDate(), y: 15 },
                { x: moment("2020-11-03T0", format).toDate(), y: 60 },
                { x: moment("2020-11-04T0", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getInsideDstData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2021-04-03T0", format).toDate(), y: 30 },
                { x: moment("2021-04-04T0", format).toDate(), y: 95 },
                { x: moment("2021-04-05T0", format).toDate(), y: 15 },
                { x: moment("2021-04-06T0", format).toDate(), y: 60 },
                { x: moment("2021-04-07T0", format).toDate(), y: 35 },
            ],
        },
    ];
}

function getOutsideDstData(): Partial<IDataSeries<IAccessors>>[] {
    const format = "YYYY-MM-DDTHH";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2020-12-01T0", format).toDate(), y: 30 },
                { x: moment("2020-12-02T0", format).toDate(), y: 95 },
                { x: moment("2020-12-03T0", format).toDate(), y: 15 },
                { x: moment("2020-12-04T0", format).toDate(), y: 60 },
                { x: moment("2020-12-05T0", format).toDate(), y: 35 },
            ],
        },
    ];
}
