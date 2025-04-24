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

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import moment, { Moment } from "moment/moment";

import { DatePickerInnerComponent } from "./date-picker-inner.component";

/** @ignore */
@Component({
    selector: "nui-day-picker",
    templateUrl: "./date-picker-day-picker.component.html",
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class DayPickerComponent implements OnInit {
    public labels: any[] = [];
    public title: string;
    public rows: any[] = [];
    public weekNumbers: number[] = [];

    /*
     *  TODO: Check the default value, Added variable
     *  to avoid build prod crash
     */
    public todayDate: string = moment().toString();

    constructor(public datePicker: DatePickerInnerComponent) {
        this.datePicker = datePicker;
    }

    public ngOnInit(): void {
        this.datePicker.stepDay = { months: 1 };

        this.datePicker.setRefreshViewHandler((): void => {
            const picker = this.datePicker;
            const value =
                picker.value && picker.value.isValid()
                    ? picker.value.clone()
                    : moment();

            const month = value.month();
            const firstDateOfMonthDayOfWeek = value
                .clone()
                .set("date", 1)
                .day();
            const difference = picker.startingDay - firstDateOfMonthDayOfWeek;
            const numDisplayedFromPreviousMonth =
                difference > 0 ? 7 - difference : -difference;
            const firstDateOfMonth =
                numDisplayedFromPreviousMonth > 0
                    ? value
                          .clone()
                          .set("date", -numDisplayedFromPreviousMonth + 1)
                    : value.clone().set("date", 1);

            // 42 is the number of days on a six-week calendar
            const _days: any[] = this.getDates(firstDateOfMonth, 42);
            const days: any[] = [];

            for (let i = 0; i < 42; i++) {
                const handler = this.datePicker.handleTimezone
                    ? moment.parseZone
                    : moment;
                const _dateObject = picker.createDateObject(
                    handler(_days[i].date),
                    picker.formatDay
                );

                _dateObject.secondary = _days[i].month !== month;
                _dateObject.uid = picker.uniqueId + "-" + i;
                _dateObject.isCellVisible = !(
                    picker.onlyCurrentMonth && _dateObject.secondary
                );
                days[i] = _dateObject;
            }

            this.labels = [];

            for (let j = 0; j < 7; j++) {
                this.labels[j] = {
                    abbr: picker.formatDate(
                        days[j].date,
                        picker.formatDayHeader
                    ),
                    full: picker.formatDate(days[j].date, "EEEE"),
                };
            }

            this.title = picker.formatDate(value, picker.formatDayTitle);
            this.rows = picker.split(days, 7).map((row) => ({
                days: row,
                isRowVisible: !(
                    picker.onlyCurrentMonth &&
                    row[0].secondary &&
                    row[6].secondary
                ),
            }));

            if (picker.showWeeks) {
                const thursdayIndex = (4 + 7 - picker.startingDay) % 7;
                const numWeeks = this.rows.length;

                this.weekNumbers = [];

                for (let curWeek = 0; curWeek < numWeeks; curWeek++) {
                    this.weekNumbers.push(
                        moment(
                            this.rows[curWeek].days[thursdayIndex].date
                        ).isoWeek()
                    );
                }
            }
        }, "day");

        this.datePicker.setCompareHandler(
            (date1: Moment, date2: Moment): number => {
                const d1 = moment({
                    year: date1.year(),
                    month: date1.month(),
                    date: date1.date(),
                });
                const d2 = moment({
                    year: date2.year(),
                    month: date2.month(),
                    date: date2.date(),
                });
                return d1.valueOf() - d2.valueOf();
            },
            "day"
        );
    }

    protected getDates(startDate: Moment, n: number): Moment[] {
        const dates: any[] = new Array(n);

        let current = startDate.clone();
        let i = 0;

        while (i < n) {
            dates[i++] = {
                date: current.toISOString(this.datePicker.handleTimezone),
                day: current.day(),
                month: current.month(),
            };

            current = current.clone().date(current.date() + 1);
        }

        return dates;
    }
}
