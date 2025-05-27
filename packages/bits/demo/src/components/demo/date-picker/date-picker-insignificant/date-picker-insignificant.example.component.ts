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

import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import moment, { Moment } from "moment/moment";

import { IToastService, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-date-picker-insignificant-example",
    templateUrl: "./date-picker-insignificant.example.component.html",
})
export class DatePickerInsignificantExampleComponent {
    public dt: Moment = moment().endOf("day");
    public selectedDate: Date;
    public control = new FormControl(this.dt, { nonNullable: true });

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    public dateChanged(event: Moment): void {
        this.selectedDate = new Date(event.valueOf());
        this.toastService.info({
            message: $localize`Selected date: ${event.toString()}`,
        });
    }
}
