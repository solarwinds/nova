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
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NuiRadioModule } from "../../../../../../src/lib/radio/radio.module";
import { NgFor } from "@angular/common";
import { RadioGroupInFormExampleComponent } from "../radio-group-in-form/radio-group-in-form.example.component";
import { NuiFormFieldModule } from "../../../../../../src/lib/form-field/form-field.module";

@Component({
    selector: "nui-radio-group-visual-test",
    templateUrl: "./radio-group-visual-test.component.html",
    imports: [NuiRadioModule, NgFor, RadioGroupInFormExampleComponent, FormsModule, ReactiveFormsModule, NuiFormFieldModule]
})
export class RadioGroupVisualTestComponent {
    public disabledForm;
    public colors = ["Red", "Green", "Blue"];
    public colorHints = {
        Red: "hot color",
        Green: "color of nature",
        Blue: "color of sky",
    };
    public fruits = ["Banana", "Orange", "Kiwi", "Papaya"];
    public selectedFruit: string;
    public selectedColor: string;

    constructor(private formBuilder: FormBuilder) {
        this.disabledForm = this.formBuilder.group({
            radioGroup: this.formBuilder.control({ value: "", disabled: true }),
        });
    }
}
