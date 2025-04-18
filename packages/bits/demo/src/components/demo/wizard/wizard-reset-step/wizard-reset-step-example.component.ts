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

import { Component, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IWizardSelectionEvent, WizardComponent } from "@nova-ui/bits";
import { NuiFormFieldModule } from "../../../../../../src/lib/form-field/form-field.module";
import { NuiTextboxModule } from "../../../../../../src/lib/textbox/textbox.module";
import { NgIf } from "@angular/common";
import { NuiValidationMessageModule } from "../../../../../../src/lib/validation-message/validation-message.module";
import { NuiCheckboxModule } from "../../../../../../src/lib/checkbox/checkbox.module";
import { NuiWizardModule } from "../../../../../../src/lib/wizard/wizard.module";

@Component({
    selector: "nui-wizard-reset-step-example",
    templateUrl: "./wizard-reset-step.example.component.html",
    imports: [FormsModule, ReactiveFormsModule, NuiFormFieldModule, NuiTextboxModule, NgIf, NuiValidationMessageModule, NuiCheckboxModule, NuiWizardModule]
})
export class WizardResetStepExampleComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    public myForm;
    public secondStepForm;

    constructor(private formBuilder: FormBuilder) {
        this.myForm = this.formBuilder.group({
            name: ["", Validators.required],
            email: [
                "",
                [
                    Validators.required,
                    Validators.pattern("[^ @]*@[^ @]*"),
                    Validators.email,
                ],
            ],
            password: ["", [Validators.required]],
        });
        this.secondStepForm = this.formBuilder.group({
            formCheckbox: [false, [Validators.requiredTrue]],
        });
    }

    public updateValidity(): void {
        this.secondStepForm.get("formCheckbox")?.updateValueAndValidity();
    }

    public onSelectionChange(event: IWizardSelectionEvent): void {
        const {
            selectedIndex,
            previouslySelectedStep,
            previouslySelectedIndex,
        } = event;

        /* Example of reset statuses of second step */
        if (selectedIndex === 0 && previouslySelectedIndex === 1) {
            if (this.secondStepForm.invalid) {
                this.wizardComponent.resetStep(previouslySelectedStep);
            }
        }
    }
}
