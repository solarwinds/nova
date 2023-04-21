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
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDatePickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiProgressModule,
    NuiRadioModule,
    NuiSpinnerModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    NuiWizardV2Module,
    SrlcStage,
    NuiSelectV2Module,
    NuiOverlayModule,
    NuiTooltipModule,
} from "@nova-ui/bits";

import {
    WizardBusyExampleComponent,
    WizardCustomComponent,
    WizardCustomExampleComponent,
    WizardCustomFooterExampleComponent,
    WizardDialogExampleComponent,
    WizardDocsComponent,
    WizardDynamicExampleComponent,
    WizardHorizontalExampleComponent,
    WizardRemoveStepExampleComponent,
    WizardVerticalExampleComponent,
    WizardAsyncFormValidationExampleComponent,
    WizardWithCustomIconsExampleComponent,
    WizardRestoreStateExampleComponent,
    WizardStepChangeExampleComponent,
    WizardResponsiveHeaderExampleComponent,
    WizardWithConfirmationDialogOnCancelExampleComponent,
    WizardTooltipExampleComponent,
    WizardV2TestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: WizardDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "confirm-on-cancel",
        component: WizardWithConfirmationDialogOnCancelExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: WizardV2TestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: false,
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiMessageModule,
        NuiDocsModule,
        NuiTextboxModule,
        NuiRadioModule,
        NuiCheckboxModule,
        NuiDialogModule,
        NuiValidationMessageModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NuiWizardV2Module,
        NuiSpinnerModule,
        NuiBusyModule,
        NuiProgressModule,
        NuiDatePickerModule,
        NuiIconModule,
        NuiSelectV2Module,
        NuiOverlayModule,
        NuiTooltipModule,
    ],
    declarations: [
        WizardDocsComponent,
        WizardHorizontalExampleComponent,
        WizardVerticalExampleComponent,
        WizardCustomExampleComponent,
        WizardCustomComponent,
        WizardDialogExampleComponent,
        WizardBusyExampleComponent,
        WizardCustomFooterExampleComponent,
        WizardDynamicExampleComponent,
        WizardRemoveStepExampleComponent,
        WizardAsyncFormValidationExampleComponent,
        WizardWithCustomIconsExampleComponent,
        WizardRestoreStateExampleComponent,
        WizardStepChangeExampleComponent,
        WizardResponsiveHeaderExampleComponent,
        WizardWithConfirmationDialogOnCancelExampleComponent,
        WizardTooltipExampleComponent,
        WizardV2TestComponent,
    ],
    exports: [RouterModule],
})
export default class WizardV2Module {}
