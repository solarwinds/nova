import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";
import { Moment } from "moment/moment";

import { DatePickerInnerComponent } from "./date-picker-inner.component";
/** @ignore */
@Component({
    selector: "nui-year-picker",
    templateUrl: "./date-picker-year-picker.component.html",
})
export class YearPickerComponent implements OnInit {
    title: string;
    rows: any[] = [];

    constructor(public datePicker: DatePickerInnerComponent) {
        this.datePicker = datePicker;
    }

    ngOnInit(): void {
        this.datePicker.stepYear = {years: this.datePicker.yearRange};

        this.datePicker.setRefreshViewHandler((): void => {
            const picker = this.datePicker;
            const years: any[] = new Array(picker.yearRange);

            let date: Moment = picker.value && picker.value.isValid()
                ? picker.value.clone()
                : moment();
            date = date.set("date", 1);

            const start = this.getStartingYear(date.year());

            for (let i = 0; i < picker.yearRange; i++) {
                date = date.set({"year": start + i});
                years[i] = picker.createDateObject(date, picker.formatYear);
                years[i].uid = picker.uniqueId + "-" + i;
            }

            this.title = [years[0].label, years[picker.yearRange - 1].label].join(" - ");
            this.rows = picker.split(years, 5);
        }, "year");

        this.datePicker.setCompareHandler((date1: Moment, date2: Moment): number => date1.year() - date2.year(), "year");
    }

    protected getStartingYear(year: number): number {
        return ((year - 1) / this.datePicker.yearRange * this.datePicker.yearRange + 1);
    }
}
