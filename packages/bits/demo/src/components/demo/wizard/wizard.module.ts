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
    NuiDialogModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiRadioModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    NuiWizardModule,
    SrlcStage,
    NuiBusyModule,
    NuiSpinnerModule,
} from "@nova-ui/bits";

import {
    WizardAdditionalButtonExampleComponent,
    WizardBusyExampleComponent,
    WizardConfirmationDialogExampleComponent,
    WizardConstantHeightExampleComponent,
    WizardCustomStepLineWidthComponent,
    WizardDialogExampleComponent,
    WizardDisabledExampleComponent,
    WizardDynamicExampleComponent,
    WizardExampleComponent,
    WizardHiddenExampleComponent,
    WizardSimpleExampleComponent,
    WizardStepsExampleComponent,
    WizardValidationExampleComponent,
    WizardVisualTestComponent,
    WizardDynamicRemoveExampleComponent,
    WizardResetStepExampleComponent,
    WizardWithSeparateStepHeadingsExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: WizardExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "wizard-test",
        component: WizardExampleComponent,
    },
    {
        path: "wizard-visual-test",
        component: WizardVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "wizard-steps",
        component: WizardStepsExampleComponent,
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiWizardModule,
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
        NuiBusyModule,
        NuiSpinnerModule,
    ],
    declarations: [
        WizardAdditionalButtonExampleComponent,
        WizardBusyExampleComponent,
        WizardConfirmationDialogExampleComponent,
        WizardConstantHeightExampleComponent,
        WizardDialogExampleComponent,
        WizardDisabledExampleComponent,
        WizardDynamicExampleComponent,
        WizardExampleComponent,
        WizardHiddenExampleComponent,
        WizardSimpleExampleComponent,
        WizardValidationExampleComponent,
        WizardVisualTestComponent,
        WizardCustomStepLineWidthComponent,
        WizardDynamicRemoveExampleComponent,
        WizardStepsExampleComponent,
        WizardResetStepExampleComponent,
        WizardWithSeparateStepHeadingsExampleComponent,
    ],
    exports: [RouterModule],
})
export default class WizardModule {}
