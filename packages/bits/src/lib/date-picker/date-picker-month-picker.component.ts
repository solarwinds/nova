import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";
import { Moment } from "moment/moment";

import { DatePickerInnerComponent } from "./date-picker-inner.component";
/** @ignore */
@Component({
    selector: "nui-month-picker",
    templateUrl: "./date-picker-month-picker.component.html",
})
export class MonthPickerComponent implements OnInit {
    title: string;
    rows: any[] = [];
    maxMode: string;

    constructor(public datePicker: DatePickerInnerComponent) {
        this.datePicker = datePicker;
    }

    ngOnInit(): void {
        this.datePicker.stepMonth = {years: 1};

        this.datePicker.setRefreshViewHandler((): void => {
            const picker = this.datePicker;
            const months: any[] = new Array(12);

            let date: Moment = picker.value && picker.value.isValid()
                ? picker.value.clone()
                : moment();
            date = date.set("date", 1);

            for (let i = 0; i < 12; i++) {
                date = date.clone().set("month", i);
                months[i] = picker.createDateObject(date, picker.formatMonth);
                months[i].uid = picker.uniqueId + "-" + i;
            }

            this.title = picker.formatDate(date, picker.formatMonthTitle);
            this.rows = picker.split(months, 3);
        }, "month");

        this.datePicker.setCompareHandler((date1: Moment, date2: Moment): number => {
            const d1 = moment({"year": date1.year(), "month": date1.month()});
            const d2 = moment({"year": date2.year(), "month": date2.month()});
            return d1.valueOf() - d2.valueOf();
        }, "month");
    }
}
