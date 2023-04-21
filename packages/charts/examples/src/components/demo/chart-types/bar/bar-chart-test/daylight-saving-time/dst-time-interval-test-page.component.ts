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

import { Component } from "@angular/core";
import moment, { duration } from "moment/moment";

import { IAccessors, IDataSeries } from "@nova-ui/charts";

import { DateTimeUtil } from "./date-time-util";

@Component({
    templateUrl: "./dst-time-interval-test-page.component.html",
})
export class DstTimeIntervalTestPageComponent {
    public insideDstData = getInsideDstData();
    public outsideDstData = getOutsideDstData();
    public startDstOneMinuteData: Partial<IDataSeries<IAccessors>>[];
    public startDstOneHourData: Partial<IDataSeries<IAccessors>>[];
    public startDstTwoHourData: Partial<IDataSeries<IAccessors>>[];
    public startDstOneDayData: Partial<IDataSeries<IAccessors>>[];
    public endDstOneMinuteData: Partial<IDataSeries<IAccessors>>[];
    public endDstOneHourData: Partial<IDataSeries<IAccessors>>[];
    public endDstTwoHourData: Partial<IDataSeries<IAccessors>>[];
    public endDstOneDayData: Partial<IDataSeries<IAccessors>>[];
    public oneMinuteInterval = duration(1, "minute");
    public oneDayInterval = duration(1, "days");
    public oneHourInterval = duration(1, "hours");
    public twoHourInterval = duration(2, "hours");

    private startDstMidnight: Date;
    private startDstHour: Date;
    private endDstMidnight: Date;
    private endDstHour: Date;

    constructor() {
        this.startDstMidnight = DateTimeUtil.getStartDstMidnight(2021);
        this.startDstHour = DateTimeUtil.getStartDstHour(2021);
        this.endDstMidnight = DateTimeUtil.getEndDstMidnight(2021);
        this.endDstHour = DateTimeUtil.getEndDstHour(2021);

        this.startDstOneMinuteData = getStartDstOneMinuteData(
            this.startDstHour
        );
        this.startDstOneHourData = getStartDstOneHourData(this.startDstHour);
        this.startDstTwoHourData = getStartDstTwoHourData(this.startDstHour);
        this.startDstOneDayData = getStartDstOneDayData(this.startDstMidnight);
        this.endDstOneMinuteData = getEndDstOneMinuteData(this.endDstHour);
        this.endDstOneHourData = getEndDstOneHourData(this.endDstHour);
        this.endDstTwoHourData = getEndDstTwoHourData(this.endDstHour);
        this.endDstOneDayData = getEndDstOneDayData(this.endDstMidnight);

        console.log(
            "Local Time Zone:",
            Intl.DateTimeFormat().resolvedOptions().timeZone
        );
    }
}

function getStartDstOneMinuteData(
    startDstHour: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    x: moment(startDstHour).subtract(1, "minute").toDate(),
                    y: 30,
                },
                { x: startDstHour, y: 95 },
                { x: moment(startDstHour).add(1, "minute").toDate(), y: 15 },
                { x: moment(startDstHour).add(2, "minutes").toDate(), y: 60 },
                { x: moment(startDstHour).add(3, "minutes").toDate(), y: 35 },
            ],
        },
    ];
}

function getStartDstOneHourData(
    startDstHour: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment(startDstHour).subtract(1, "hour").toDate(), y: 30 },
                { x: startDstHour, y: 95 },
                { x: moment(startDstHour).add(1, "hour").toDate(), y: 15 },
                { x: moment(startDstHour).add(2, "hours").toDate(), y: 60 },
                { x: moment(startDstHour).add(3, "hours").toDate(), y: 35 },
            ],
        },
    ];
}

function getStartDstTwoHourData(
    startDstHour: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    x: moment(startDstHour).subtract(2, "hours").toDate(),
                    y: 30,
                },
                { x: startDstHour, y: 95 },
                { x: moment(startDstHour).add(2, "hours").toDate(), y: 15 },
                { x: moment(startDstHour).add(4, "hours").toDate(), y: 60 },
                { x: moment(startDstHour).add(6, "hours").toDate(), y: 35 },
            ],
        },
    ];
}

function getStartDstOneDayData(
    startDstMidnight: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    x: moment(startDstMidnight).subtract(1, "day").toDate(),
                    y: 30,
                },
                { x: startDstMidnight, y: 95 },
                { x: moment(startDstMidnight).add(1, "day").toDate(), y: 15 },
                { x: moment(startDstMidnight).add(2, "days").toDate(), y: 60 },
                { x: moment(startDstMidnight).add(3, "days").toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstOneMinuteData(
    endDstHour: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment(endDstHour).subtract(1, "minute").toDate(), y: 30 },
                { x: endDstHour, y: 95 },
                { x: moment(endDstHour).add(1, "minute").toDate(), y: 15 },
                { x: moment(endDstHour).add(2, "minutes").toDate(), y: 60 },
                { x: moment(endDstHour).add(3, "minutes").toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstOneHourData(
    endDstHour: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment(endDstHour).subtract(1, "hour").toDate(), y: 30 },
                { x: endDstHour, y: 95 },
                { x: moment(endDstHour).add(1, "hour").toDate(), y: 15 },
                { x: moment(endDstHour).add(2, "hours").toDate(), y: 60 },
                { x: moment(endDstHour).add(3, "hours").toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstTwoHourData(
    endDstHour: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment(endDstHour).subtract(2, "hours").toDate(), y: 30 },
                { x: endDstHour, y: 95 },
                { x: moment(endDstHour).add(2, "hours").toDate(), y: 15 },
                { x: moment(endDstHour).add(4, "hours").toDate(), y: 60 },
                { x: moment(endDstHour).add(6, "hours").toDate(), y: 35 },
            ],
        },
    ];
}

function getEndDstOneDayData(
    endDstMidnight: Date
): Partial<IDataSeries<IAccessors>>[] {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    x: moment(endDstMidnight).subtract(1, "day").toDate(),
                    y: 30,
                },
                { x: endDstMidnight, y: 95 },
                { x: moment(endDstMidnight).add(1, "day").toDate(), y: 15 },
                { x: moment(endDstMidnight).add(2, "days").toDate(), y: 60 },
                { x: moment(endDstMidnight).add(3, "days").toDate(), y: 35 },
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
                { x: moment("2021-07-03T0", format).toDate(), y: 30 },
                { x: moment("2021-07-04T0", format).toDate(), y: 95 },
                { x: moment("2021-07-05T0", format).toDate(), y: 15 },
                { x: moment("2021-07-06T0", format).toDate(), y: 60 },
                { x: moment("2021-07-07T0", format).toDate(), y: 35 },
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
