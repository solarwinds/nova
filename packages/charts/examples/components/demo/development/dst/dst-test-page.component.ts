import { Component } from "@angular/core";
import { IAccessors, IDataSeries } from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    templateUrl: "./dst-test-page.component.html",
})
export class DstTestPageComponent {
    public insideDstData = getInsideDstData();
    public outsideDstData = getOutsideDstData();
    public startDstData = getStartDstData();
    public endDstData = getEndDstData();
}

function getStartDstData(): Partial<IDataSeries<IAccessors>>[] {
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

function getEndDstData(): Partial<IDataSeries<IAccessors>>[] {
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
