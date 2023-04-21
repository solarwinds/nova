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
import { FormBuilder, Validators } from "@angular/forms";

import { WizardComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-validation-example",
    templateUrl: "./wizard-validation.example.component.html",
})
export class WizardValidationExampleComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    public myForm;
    public secondStepForm;

    constructor(private formBuilder: FormBuilder) {
        this.myForm = this.formBuilder.group({
            name: this.formBuilder.control("", Validators.required),
            email: this.formBuilder.control("", [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*"),
                Validators.email,
            ]),
            password: this.formBuilder.control("", [
                Validators.required,
                Validators.minLength(8),
            ]),
        });
        this.secondStepForm = this.formBuilder.group({
            formCheckbox: [false, [Validators.requiredTrue]],
        });
    }

    public updateValidity(): void {
        this.secondStepForm.controls.formCheckbox?.updateValueAndValidity();
    }
}
