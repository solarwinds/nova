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
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Moment } from "moment/moment";
import { NuiFormFieldModule } from "../../../../../../src/lib/form-field/form-field.module";
import { NuiDateTimePickerModule } from "../../../../../../src/lib/date-time-picker/date-time-picker.module";
import { NuiValidationMessageModule } from "../../../../../../src/lib/validation-message/validation-message.module";

@Component({
    selector: "nui-date-time-picker-empty-state",
    templateUrl: "./date-time-picker-empty-state.component.html",
    imports: [NuiFormFieldModule, NuiDateTimePickerModule, FormsModule, ReactiveFormsModule, NuiValidationMessageModule]
})
export class DateTimePickerEmptyStateComponent {
    public dt: Moment | undefined = undefined;
    public selectedDate: Date | string = "";
    public initEmpty: boolean = true;
    public control = new FormControl(this.dt, Validators.required);

    constructor() {}

    public onModelChanged(event: Moment): void {
        this.selectedDate = new Date(event.valueOf());
    }
}
