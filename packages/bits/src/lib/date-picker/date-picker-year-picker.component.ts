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

import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";
import { Moment } from "moment/moment";

import { DatePickerInnerComponent } from "./date-picker-inner.component";
/** @ignore */
@Component({
    selector: "nui-year-picker",
    templateUrl: "./date-picker-year-picker.component.html",
    standalone: false
})
export class YearPickerComponent implements OnInit {
    title: string;
    rows: any[] = [];

    constructor(public datePicker: DatePickerInnerComponent) {
        this.datePicker = datePicker;
    }

    public ngOnInit(): void {
        this.datePicker.stepYear = { years: this.datePicker.yearRange };

        this.datePicker.setRefreshViewHandler((): void => {
            const picker = this.datePicker;
            const years: any[] = new Array(picker.yearRange);

            let date: Moment =
                picker.value && picker.value.isValid()
                    ? picker.value.clone()
                    : moment();
            date = date.set("date", 1);

            const start = this.getStartingYear(date.year());

            for (let i = 0; i < picker.yearRange; i++) {
                date = date.set({ year: start + i });
                years[i] = picker.createDateObject(date, picker.formatYear);
                years[i].uid = picker.uniqueId + "-" + i;
            }

            this.title = [
                years[0].label,
                years[picker.yearRange - 1].label,
            ].join(" - ");
            this.rows = picker.split(years, 5);
        }, "year");

        this.datePicker.setCompareHandler(
            (date1: Moment, date2: Moment): number =>
                date1.year() - date2.year(),
            "year"
        );
    }

    protected getStartingYear(year: number): number {
        return (
            ((year - 1) / this.datePicker.yearRange) *
                this.datePicker.yearRange +
            1
        );
    }
}
