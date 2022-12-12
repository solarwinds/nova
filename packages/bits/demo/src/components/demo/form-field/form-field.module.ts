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
    NuiCheckboxModule,
    NuiDatePickerModule,
    NuiDateTimePickerModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiRadioModule,
    NuiSelectModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    NuiTextboxModule,
    NuiTimePickerModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import { FormFieldBasicHintExampleComponent } from "./basic-hint/form-field-hint.example.component";
import { FormFieldBasicReactiveCustomValidationExampleComponent } from "./basic-reactive/basic-reactive-form-field-custom-validation.example.component";
import {
    FirstCustomFormExampleComponent,
    FormFieldBasicExampleComponent,
    FormFieldBasicReactiveExampleComponent,
    FormFieldComplexExampleComponent,
    FormFieldDynamicDisablingExampleComponent,
    FormFieldExampleComponent,
    FormFieldInFormExampleComponent,
    FormFieldTestComponent,
    FormFieldValidationTriggeringxampleComponent,
    FormFieldVisualTestComponent,
    FormFieldWithHTMLExampleComponent,
    NestedFormsAsComponentExampleComponent,
    SecondCustomFormExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: FormFieldExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "form-field-test",
        component: FormFieldTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "form-field-visual-test",
        component: FormFieldVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "form-field-validation-triggering",
        component: FormFieldValidationTriggeringxampleComponent,
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
        NuiFormFieldModule,
        NuiValidationMessageModule,
        NuiTextboxModule,
        FormsModule,
        ReactiveFormsModule,
        NuiSelectModule,
        NuiRadioModule,
        NuiIconModule,
        NuiDatePickerModule,
        NuiDocsModule,
        NuiSwitchModule,
        NuiDateTimePickerModule,
        NuiTimePickerModule,
        NuiCheckboxModule,
        RouterModule.forChild(routes),
        NuiSelectV2Module,
    ],
    declarations: [
        FormFieldExampleComponent,
        FormFieldBasicExampleComponent,
        FormFieldBasicHintExampleComponent,
        FormFieldBasicReactiveExampleComponent,
        FormFieldBasicReactiveCustomValidationExampleComponent,
        FormFieldComplexExampleComponent,
        FormFieldDynamicDisablingExampleComponent,
        FormFieldInFormExampleComponent,
        FormFieldTestComponent,
        FormFieldVisualTestComponent,
        FormFieldWithHTMLExampleComponent,
        NestedFormsAsComponentExampleComponent,
        FirstCustomFormExampleComponent,
        SecondCustomFormExampleComponent,
        FormFieldValidationTriggeringxampleComponent,
    ],
    exports: [RouterModule],
})
export default class FormFieldModule {}
