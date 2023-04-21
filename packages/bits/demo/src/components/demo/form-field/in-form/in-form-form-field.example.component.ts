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
import { FormBuilder, Validators } from "@angular/forms";
import moment from "moment/moment";

@Component({
    selector: "nui-form-field-in-form-example",
    templateUrl: "./in-form-form-field.example.component.html",
})
export class FormFieldInFormExampleComponent {
    public vegetables = [
        $localize`Cabbage`,
        $localize`Potato`,
        $localize`Tomato`,
        $localize`Carrot`,
    ];
    public fancyForm;

    constructor(
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ) {
        this.fancyForm = this.formBuilder.group({
            textbox: this.formBuilder.control("", [Validators.required]),
            textNumber: this.formBuilder.control(0, [Validators.required]),
            checkbox: this.formBuilder.control(true, [Validators.requiredTrue]),
            checkboxGroup: this.formBuilder.control(
                ["Cabbage", "Potato"],
                [Validators.required]
            ),
            radioGroup: this.formBuilder.control(this.vegetables[1], [
                Validators.required,
            ]),
            switch: this.formBuilder.control(false, [Validators.requiredTrue]),
            select: this.formBuilder.control("", [Validators.required]),
            combobox: this.formBuilder.control("", [Validators.required]),
            datePicker: this.formBuilder.control(moment()),
            timePicker: this.formBuilder.control("", [Validators.required]),
            dateTimePicker: this.formBuilder.control(moment(), [
                Validators.required,
            ]),
        });
    }
}
