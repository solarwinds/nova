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
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { DatePickerBasicExampleComponent } from "../date-picker-basic/date-picker-basic.example.component";
import { DatePickerValueChangeExampleComponent } from "../date-picker-value-change/date-picker-value-change.example.component";
import { DatePickerCalendarNavigatedExampleComponent } from "../date-picker-calendar-navigated/date-picker-calendar-navigated.example.component";
import { DatePickerDisabledExampleComponent } from "../date-picker-disabled/date-picker-disabled.example.component";
import { DatePickerWithErrorExampleComponent } from "../date-picker-with-error/date-picker-with-error.example.component";
import { DatePickerInlineExampleComponent } from "../date-picker-inline/date-picker-inline.example.component";
import { DatePickerCurrentMonthExampleComponent } from "../date-picker-current-month/date-picker-current-month.example.component";
import { DatePickerShowWeeksExampleComponent } from "../date-picker-show-weeks/date-picker-show-weeks.example.component";
import { DatePickerFirstDateOfWeekExampleComponent } from "../date-picker-first-date-of-week/date-picker-first-date-of-week.example.component";
import { DatePickerInitDateExampleComponent } from "../date-picker-init-date/date-picker-init-date.example.component";
import { DatePickerReactiveFormExampleComponent } from "../date-picker-reactive-form/date-picker-reactive-form.example.component";
import { DatePickerDateRangeExampleComponent } from "../date-picker-date-range/date-picker-date-range.example.component";
import { DatePickerInitModeExampleComponent } from "../date-picker-init-mode/date-picker-init-mode.example.component";
import { DatePickerModesRangeExampleComponent } from "../date-picker-modes-range/date-picker-modes-range.example.component";
import { DatePickerYearRangeExampleComponent } from "../date-picker-year-range/date-picker-year-range.example.component";
import { DatePickerDisableDateExampleComponent } from "../date-picker-disable-date/date-picker-disable-date.example.component";
import { DatePickerFormattingExampleComponent } from "../date-picker-formatting/date-picker-formatting.example.component";
import { DatePickerInsignificantExampleComponent } from "../date-picker-insignificant/date-picker-insignificant.example.component";
import { DatePickerTimezoneExampleComponent } from "../date-picker-timezone/date-picker-timezone.example.component";

@Component({
    selector: "nui-date-picker-docs-example",
    templateUrl: "./date-picker-docs.example.component.html",
    imports: [NuiMessageModule, NuiDocsModule, DatePickerBasicExampleComponent, DatePickerValueChangeExampleComponent, DatePickerCalendarNavigatedExampleComponent, DatePickerDisabledExampleComponent, DatePickerWithErrorExampleComponent, DatePickerInlineExampleComponent, DatePickerCurrentMonthExampleComponent, DatePickerShowWeeksExampleComponent, DatePickerFirstDateOfWeekExampleComponent, DatePickerInitDateExampleComponent, DatePickerReactiveFormExampleComponent, DatePickerDateRangeExampleComponent, DatePickerInitModeExampleComponent, DatePickerModesRangeExampleComponent, DatePickerYearRangeExampleComponent, DatePickerDisableDateExampleComponent, DatePickerFormattingExampleComponent, DatePickerInsignificantExampleComponent, DatePickerTimezoneExampleComponent]
})
export class DatePickerDocsComponent {}
