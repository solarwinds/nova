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
import { FormBuilder } from "@angular/forms";
import moment, { Moment } from "moment/moment";

import { IDatePickerDisabledDate } from "@nova-ui/bits";

@Component({
    selector: "nui-date-picker-test",
    templateUrl: "./date-picker-test.component.html",
})
export class DatePickerTestComponent {
    public dt: Moment;
    public dtPreserve: Moment;
    public minDate: Moment;
    public maxDate: Moment;
    public localActiveDate: Moment;
    public localActiveDatePreserve: Moment;
    public localActiveDateMinMax: Moment;
    public localActiveDateDisabledDates: Moment;
    public initDate: Moment;
    public initDatePreserve: Moment;
    public month: number;
    public year: number;
    public caption: string;
    public reactiveDatepickerForm;
    public dateDisabled: IDatePickerDisabledDate[];
    public todayDateDisabled: IDatePickerDisabledDate[];

    constructor(private formBuilder: FormBuilder) {
        this.reactiveDatepickerForm = this.formBuilder.group({
            datePicker: this.formBuilder.control(moment()),
        });
        this.dt = moment();
        this.dtPreserve = moment();
        this.localActiveDate = this.dt;
        this.localActiveDatePreserve = this.dtPreserve;
        this.localActiveDateMinMax = this.dt;
        this.localActiveDateDisabledDates = this.dt;
        this.month = this.dt.month() + 1;
        this.year = this.dt.year();
        this.minDate = moment({
            year: this.year,
            month: this.month - 1,
            date: 5,
        });
        this.maxDate = moment({
            year: this.year,
            month: this.month - 1,
            date: 25,
        });
        this.caption = "Custom caption for date-picker";
        this.initDate = moment().utcOffset(0).hour(23).minute(15).add(1, "day");
        this.initDatePreserve = this.initDate;
        this.dateDisabled = [
            {
                date: moment({
                    year: this.year,
                    month: this.month - 1,
                    date: 10,
                }),
                mode: "day",
            },
            {
                date: moment({
                    year: this.year,
                    month: this.month - 1,
                    date: 11,
                }),
                mode: "day",
            },
            {
                date: moment({
                    year: this.year,
                    month: this.month - 1,
                    date: 12,
                }),
                mode: "day",
            },
            {
                date: moment({ year: this.year, month: this.month, date: 12 }),
                mode: "month",
            },
            {
                date: moment({
                    year: this.year + 1,
                    month: this.month - 1,
                    date: 12,
                }),
                mode: "year",
            },
        ];
        this.todayDateDisabled = [
            {
                date: this.dt,
                mode: "day",
            },
        ];
    }

    public dateChanged(event: any): void {
        this.localActiveDate = event;
    }

    public dateChangedPreserved(event: any): void {
        this.localActiveDatePreserve = event;
    }

    public dateChangedMinMax(event: any): void {
        this.localActiveDateMinMax = event;
    }

    public dateChangedDisabledDates(event: any): void {
        this.localActiveDateDisabledDates = event;
    }

    public initDateChangedPreserved(event: any): void {
        this.initDatePreserve = event;
    }
}
