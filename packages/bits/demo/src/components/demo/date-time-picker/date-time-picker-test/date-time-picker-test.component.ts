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

    onModelChanged(event: any) {
        this.selectedDate = moment(event).format("YYYY-MM-DD HH:mm");
    }
}
