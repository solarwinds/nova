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

import { Component, OnDestroy, OnInit } from "@angular/core";
import moment, { Moment } from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";

@Component({
    selector: "nui-time-picker-localized",
    templateUrl: "./time-picker-localized.example.component.html",
})
export class TimePickerLocalizedExampleComponent implements OnInit, OnDestroy {
    public minDate: Moment;
    public maxDate: Moment;
    public timeFrame: ITimeframe;

    private baseDate: Moment;
    private oldLocale: string;

    public ngOnInit(): void {
        this.oldLocale = moment.locale();
        moment.locale(window.navigator.language);

        this.baseDate = moment([2018, 5, 1, 15, 0, 0]);
        this.minDate = this.baseDate.clone().subtract(1, "months");
        this.maxDate = moment();

        this.timeFrame = {
            startDatetime: this.baseDate.clone().subtract(1, "weeks"),
            endDatetime: this.baseDate.clone(),
            // @ts-ignore
            selectedPresetId: null,
        };
    }

    public ngOnDestroy(): void {
        moment.locale(this.oldLocale);
    }
}
