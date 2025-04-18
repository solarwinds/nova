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
import { WizardHorizontalExampleComponent } from "../wizard-horizontal/wizard-horizontal.example.component";
import { WizardWithConfirmationDialogOnCancelExampleComponent } from "../wizard-with-confirmation-dialog-on-cancel/wizard-with-confirmation-dialog-on-cancel.example.component";
import { WizardDialogExampleComponent } from "../wizard-dialog/wizard-dialog.example.component";
import { WizardBusyExampleComponent } from "../wizard-busy/wizard-busy.example.component";
import { WizardDynamicExampleComponent } from "../wizard-dynamic/wizard-dynamic.example.component";
import { WizardRemoveStepExampleComponent } from "../wizard-remove-step/wizard-remove-step.example.component";
import { WizardAsyncFormValidationExampleComponent } from "../wizard-async-validation-form/wizard-async-form-validation.example.component";
import { WizardWithCustomIconsExampleComponent } from "../wizard-with-custom-icons/wizard-with-custom-icons.example.component";
import { WizardCustomFooterExampleComponent } from "../wizard-custom-footer/wizard-custom-footer.example.component";
import { WizardRestoreStateExampleComponent } from "../wizard-restore-state/wizard-restore-state.example.component";
import { WizardStepChangeExampleComponent } from "../wizard-step-change/wizard-step-change.example.component";
import { WizardResponsiveHeaderExampleComponent } from "../wizard-responsive-header/wizard-responsive-header.example.component";
import { WizardTooltipExampleComponent } from "../wizard-tooltip/wizard-tooltip.example.component";

@Component({
    selector: "nui-wizard-v2-example",
    templateUrl: "./wizard-docs.component.html",
    imports: [NuiDocsModule, WizardHorizontalExampleComponent, WizardWithConfirmationDialogOnCancelExampleComponent, WizardDialogExampleComponent, WizardBusyExampleComponent, WizardDynamicExampleComponent, WizardRemoveStepExampleComponent, WizardAsyncFormValidationExampleComponent, WizardWithCustomIconsExampleComponent, WizardCustomFooterExampleComponent, WizardRestoreStateExampleComponent, WizardStepChangeExampleComponent, WizardResponsiveHeaderExampleComponent, WizardTooltipExampleComponent]
})
export class WizardDocsComponent {}
