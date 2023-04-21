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
    NuiButtonModule,
    NuiDateTimePickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiSelectModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    DateTimePickerBasicExampleComponent,
    DateTimePickerDialogExampleComponent,
    DateTimePickerDisabledExampleComponent,
    DateTimePickerDocsComponent,
    DateTimePickerEmptyStateComponent,
    DateTimePickerInlineExampleComponent,
    DateTimePickerRangeValuesExampleComponent,
    DateTimePickerReactiveFormExampleComponent,
    DateTimePickerTestComponent,
    DateTimePickerTimezonesExampleComponent,
    DateTimePickerVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: DateTimePickerDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "date-time-picker-test",
        component: DateTimePickerTestComponent,
    },
    {
        path: "date-time-picker-visual-test",
        component: DateTimePickerVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "dialog",
        component: DateTimePickerDialogExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiDateTimePickerModule,
        NuiDialogModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NuiSelectModule,
        NuiValidationMessageModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
        NuiDialogModule,
    ],
    declarations: [
        DateTimePickerTestComponent,
        DateTimePickerBasicExampleComponent,
        DateTimePickerInlineExampleComponent,
        DateTimePickerDisabledExampleComponent,
        DateTimePickerRangeValuesExampleComponent,
        DateTimePickerVisualTestComponent,
        DateTimePickerDocsComponent,
        DateTimePickerReactiveFormExampleComponent,
        DateTimePickerEmptyStateComponent,
        DateTimePickerTimezonesExampleComponent,
        DateTimePickerDialogExampleComponent,
    ],
    exports: [RouterModule],
})
export default class DateTimePickerModule {}
