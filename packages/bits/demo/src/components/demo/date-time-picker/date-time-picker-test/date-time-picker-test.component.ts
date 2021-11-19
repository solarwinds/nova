import { Component } from "@angular/core";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-time-picker-test",
    templateUrl: "./date-time-picker-test.component.html",
})

export class DateTimePickerTestComponent {
    public dt: Moment;
    public selectedDate: string;

    constructor() {
        this.dt = moment().set({
            year: 1970,
            month: 2,
            date: 15,
            hour: 15,
            minute: 30,
        });
        this.selectedDate = moment(this.dt).format("YYYY-MM-DD HH:mm");
    }

    onModelChanged(event: any): void {
        this.selectedDate = moment(event).format("YYYY-MM-DD HH:mm");
    }
}
