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
    selector: "nui-form-field-visual-test",
    templateUrl: "./form-field-visual-test.component.html",
})
export class FormFieldVisualTestComponent {
    public fancyForm;

    public vegetables = ["Cabbage", "Potato", "Tomato", "Carrot"];

    constructor(private formBuilder: FormBuilder) {
        this.fancyForm = this.formBuilder.group({
            nickname: this.formBuilder.control("", [
                Validators.required,
                Validators.min(3),
            ]),
            city: this.formBuilder.control(""),
            textbox: this.formBuilder.control("", [Validators.required]),
            checkbox: this.formBuilder.control(false, [
                Validators.requiredTrue,
            ]),
            checkboxGroup: this.formBuilder.control("", [Validators.required]),
            radioGroup: this.formBuilder.control(null, [Validators.required]),
            switch: this.formBuilder.control(false, [Validators.requiredTrue]),
            select: this.formBuilder.control("", [Validators.required]),
            combobox: this.formBuilder.control("", [Validators.required]),
            timePicker: this.formBuilder.control("", [Validators.required]),
        });
    }

    markAsDirty(): void {
        Object.keys(this.fancyForm.controls).forEach((key) => {
            this.fancyForm.get(key)?.markAsDirty();
            this.fancyForm.get(key)?.updateValueAndValidity();
        });
    }
}
