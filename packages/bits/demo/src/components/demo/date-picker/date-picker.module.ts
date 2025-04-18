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

import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDatePickerModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiSelectModule,
    NuiSelectV2Module,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    DatePickerBasicExampleComponent,
    DatePickerCalendarNavigatedExampleComponent,
    DatePickerCurrentMonthExampleComponent,
    DatePickerDateRangeExampleComponent,
    DatePickerDisableDateExampleComponent,
    DatePickerDisabledExampleComponent,
    DatePickerDocsComponent,
    DatePickerFirstDateOfWeekExampleComponent,
    DatePickerFormattingExampleComponent,
    DatePickerInitDateExampleComponent,
    DatePickerInitModeExampleComponent,
    DatePickerInlineExampleComponent,
    DatePickerInsignificantExampleComponent,
    DatePickerModesRangeExampleComponent,
    DatePickerReactiveFormExampleComponent,
    DatePickerShowWeeksExampleComponent,
    DatePickerTestComponent,
    DatePickerTimezoneExampleComponent,
    DatePickerValueChangeExampleComponent,
    DatePickerVisualTestComponent,
    DatePickerWithErrorExampleComponent,
    DatePickerYearRangeExampleComponent,
} from "./index";
import { getDemoFiles } from "../../../static/demo-files-factory";

const routes = [
    {
        path: "",
        component: DatePickerDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "date-picker-test",
        component: DatePickerTestComponent,
    },
    {
        path: "date-picker-visual-test",
        component: DatePickerVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiDatePickerModule,
        NuiSelectModule,
        NuiFormFieldModule,
        NuiValidationMessageModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
        NuiSelectV2Module,
    ],
    declarations: [
        DatePickerBasicExampleComponent,
        DatePickerCurrentMonthExampleComponent,
        DatePickerDateRangeExampleComponent,
        DatePickerDisableDateExampleComponent,
        DatePickerDisabledExampleComponent,
        DatePickerDocsComponent,
        DatePickerFirstDateOfWeekExampleComponent,
        DatePickerFormattingExampleComponent,
        DatePickerInitDateExampleComponent,
        DatePickerInitModeExampleComponent,
        DatePickerInlineExampleComponent,
        DatePickerInsignificantExampleComponent,
        DatePickerModesRangeExampleComponent,
        DatePickerShowWeeksExampleComponent,
        DatePickerValueChangeExampleComponent,
        DatePickerWithErrorExampleComponent,
        DatePickerYearRangeExampleComponent,
        DatePickerTestComponent,
        DatePickerVisualTestComponent,
        DatePickerCalendarNavigatedExampleComponent,
        DatePickerReactiveFormExampleComponent,
        DatePickerTimezoneExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("date-picker"),
        },
    ],
    exports: [RouterModule],
})
export default class DatePickerModule {}
