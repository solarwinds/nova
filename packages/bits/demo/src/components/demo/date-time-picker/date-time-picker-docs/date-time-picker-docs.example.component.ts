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
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { DateTimePickerBasicExampleComponent } from "../date-time-picker-basic/date-time-picker-basic.example.component";
import { DateTimePickerEmptyStateComponent } from "../date-time-picker-empty-state/date-time-picker-empty-state.component";
import { DateTimePickerReactiveFormExampleComponent } from "../date-time-picker-reactive-form/date-time-picker-reactive-form.example.component";
import { DateTimePickerRangeValuesExampleComponent } from "../date-time-picker-range-values/date-time-picker-range-values.example.component";
import { DateTimePickerDisabledExampleComponent } from "../date-time-picker-disabled/date-time-picker-disabled.example.component";
import { DateTimePickerInlineExampleComponent } from "../date-time-picker-inline/date-time-picker-inline.example.component";
import { DateTimePickerTimezonesExampleComponent } from "../date-time-picker-timezones/date-time-picker-timezones.example.component";
import { DateTimePickerDialogExampleComponent } from "../date-time-picker-dialog/date-time-picker-dialog.example.component";

@Component({
    selector: "nui-date-time-picker-docs-example",
    templateUrl: "./date-time-picker-docs.example.component.html",
    imports: [NuiDocsModule, DateTimePickerBasicExampleComponent, DateTimePickerEmptyStateComponent, DateTimePickerReactiveFormExampleComponent, DateTimePickerRangeValuesExampleComponent, DateTimePickerDisabledExampleComponent, DateTimePickerInlineExampleComponent, DateTimePickerTimezonesExampleComponent, DateTimePickerDialogExampleComponent]
})
export class DateTimePickerDocsComponent {}
