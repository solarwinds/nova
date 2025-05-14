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
    selector: "nui-month-picker",
    templateUrl: "./date-picker-month-picker.component.html",
    standalone: false,
})
export class MonthPickerComponent implements OnInit {
    title: string;
    rows: any[] = [];
    maxMode: string;

    constructor(public datePicker: DatePickerInnerComponent) {
        this.datePicker = datePicker;
    }

    public ngOnInit(): void {
        this.datePicker.stepMonth = { years: 1 };

        this.datePicker.setRefreshViewHandler((): void => {
            const picker = this.datePicker;
            const months: any[] = new Array(12);

            let date: Moment =
                picker.value && picker.value.isValid()
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

        this.datePicker.setCompareHandler(
            (date1: Moment, date2: Moment): number => {
                const d1 = moment({ year: date1.year(), month: date1.month() });
                const d2 = moment({ year: date2.year(), month: date2.month() });
                return d1.valueOf() - d2.valueOf();
            },
            "month"
        );
    }
}
