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
import { FormBuilder } from "@angular/forms";

@Component({
    selector: "nui-checkbox-group-test-example",
    templateUrl: "checkbox-group-test.component.html",
})
export class CheckboxGroupTestComponent {
    public cabbage = "Cabbage";
    public potato = "Potato";
    public tomato = "Tomato";
    public carrot = "Carrot";
    public disabledOne = "DISABLED";
    public vegetables = [this.cabbage, this.potato, this.tomato, this.carrot];
    public hints = [this.cabbage, this.tomato];
    public selectedVegetables = [this.potato, this.tomato, this.disabledOne];
    public testForm;

    constructor(private formBuilder: FormBuilder) {
        this.testForm = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control({
                value: this.selectedVegetables,
                disabled: true,
            }),
            checkboxGroup2: this.formBuilder.control({
                value: this.selectedVegetables,
                disabled: false,
            }),
        });
    }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }
}
