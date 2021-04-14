import { Component } from "@angular/core";
import { IAccessors, IDataSeries } from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    templateUrl: "./dst-test-page.component.html",
})
export class DstTestPageComponent {
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
