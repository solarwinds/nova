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
import { FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "nui-form-field-validation-triggering-example",
    templateUrl: "./form-field-validation-triggering.example.component.html",
})
export class FormFieldValidationTriggeringxampleComponent {
    public reactiveForm;

    constructor(private formBuilder: FormBuilder) {
        this.reactiveForm = this.formBuilder.group({
            email: this.formBuilder.control(""),
        });
    }

    public onAddValidators(): void {
        this.reactiveForm
            .get("email")
            ?.setValidators([Validators.required, Validators.email]);
    }

    public onTouch(): void {
        if (
            this.reactiveForm.get("email")?.value === "" &&
            this.reactiveForm.get("email")?.errors === null &&
            this.reactiveForm.get("email")?.validator
        ) {
            this.reactiveForm.get("email")?.setErrors({ required: true });
        }
        this.reactiveForm.get("email")?.markAsTouched();
    }

    public onValueChange(): void {
        const text =
            this.reactiveForm.get("email")?.value === ""
                ? "some text here"
                : "";
        this.reactiveForm.get("email")?.setValue(text);
    }

    public onStatusChange(): void {
        const errors = this.reactiveForm.valid ? { hasError: true } : null;
        this.reactiveForm.get("email")?.setErrors(errors);
    }

    public onReset(): void {
        this.reactiveForm.get("email")?.reset("");
        this.reactiveForm.get("email")?.setErrors(null);
        this.reactiveForm.get("email")?.setValidators(null);
    }
}
