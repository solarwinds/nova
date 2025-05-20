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

import { ChangeDetectorRef, Component } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "nui-form-field-complex-example",
    templateUrl: "./form-field-complex.example.component.html",
})
export class FormFieldComplexExampleComponent {
    static matchPassword(group: AbstractControl): { isValid: boolean } | null {
        const password = group.get("password");
        const confirm = group.get("confirmPassword");
        if (!password || !confirm) {
            return null;
        }

        if (password.pristine || confirm.pristine) {
            return null;
        }

        group.markAsTouched();

        if (password.value === confirm.value) {
            return null;
        }

        return {
            isValid: false,
        };
    }

    public fancyForm;

    constructor(
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ) {
        this.fancyForm = this.formBuilder.group(
            {
                password: this.formBuilder.control("", Validators.required),
                confirmPassword: this.formBuilder.control(
                    "",
                    Validators.required
                ),
            },
            {
                validators: [FormFieldComplexExampleComponent.matchPassword],
            }
        );
    }
}
