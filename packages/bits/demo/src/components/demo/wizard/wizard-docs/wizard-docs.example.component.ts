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
import { WizardSimpleExampleComponent } from "../wizard-simple/wizard-simple.example.component";
import { WizardWithSeparateStepHeadingsExampleComponent } from "../wizard-with-separate-step-headings/wizard-with-separate-step-headings.example.component";
import { WizardDialogExampleComponent } from "../wizard-dialog/wizard-dialog.example.component";
import { WizardBusyExampleComponent } from "../wizard-busy/wizard-busy.example.component";
import { WizardValidationExampleComponent } from "../wizard-validation/wizard-validation.example.component";
import { WizardDisabledExampleComponent } from "../wizard-disabled/wizard-disabled.example.component";
import { WizardHiddenExampleComponent } from "../wizard-hide/wizard-hide.example.component";
import { WizardDynamicExampleComponent } from "../wizard-dynamic/wizard-dynamic.example.component";
import { WizardDynamicRemoveExampleComponent } from "../wizard-dynamic-remove/wizard-dynamic-remove.example.component";
import { WizardAdditionalButtonExampleComponent } from "../wizard-additional-button/wizard-additional-button.example.component";
import { WizardConfirmationDialogExampleComponent } from "../wizard-confirmation-dialog/wizard-confirmation-dialog.example.component";
import { WizardConstantHeightExampleComponent } from "../wizard-constant-height/wizard-constant-height.example.component";
import { WizardCustomStepLineWidthComponent } from "../wizard-custom-step-line-width/wizard-custom-step-line-width.example.component";
import { WizardStepsExampleComponent } from "../wizard-steps/wizard-steps.example.component";
import { WizardResetStepExampleComponent } from "../wizard-reset-step/wizard-reset-step-example.component";

@Component({
    selector: "nui-wizard-example",
    templateUrl: "./wizard-docs.example.component.html",
    imports: [NuiMessageModule, NuiDocsModule, WizardSimpleExampleComponent, WizardWithSeparateStepHeadingsExampleComponent, WizardDialogExampleComponent, WizardBusyExampleComponent, WizardValidationExampleComponent, WizardDisabledExampleComponent, WizardHiddenExampleComponent, WizardDynamicExampleComponent, WizardDynamicRemoveExampleComponent, WizardAdditionalButtonExampleComponent, WizardConfirmationDialogExampleComponent, WizardConstantHeightExampleComponent, WizardCustomStepLineWidthComponent, WizardStepsExampleComponent, WizardResetStepExampleComponent]
})
export class WizardExampleComponent {}
