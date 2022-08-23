import { Component } from "@angular/core";
import moment from "moment/moment";

import { IDatePickerDisabledDate } from "@nova-ui/bits";

@Component({
    selector: "nui-date-picker-disable-date-example",
    templateUrl: "./date-picker-disable-date.example.component.html",
})
export class DatePickerDisableDateExampleComponent {
    private currentDate = moment();
    private yesterdayDate = this.currentDate.clone().add(-1, "days");
    private tomorrowDate = this.currentDate.clone().add(1, "days");
    private lastMonthDate = this.currentDate.clone().add(-1, "months");
    private nextYearDate = this.currentDate.clone().add(1, "years");

    public dateDisabled: IDatePickerDisabledDate[] = [
        {
            date: this.currentDate,
            mode: "day",
        },
        {
            date: this.yesterdayDate,
            mode: "day",
        },
        {
            date: this.tomorrowDate,
            mode: "day",
        },
        {
            date: this.lastMonthDate,
            mode: "month",
        },
        {
            date: this.nextYearDate,
            mode: "year",
        },
    ];
}
