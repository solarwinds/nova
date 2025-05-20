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

import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-checkbox-group-in-form-example",
    templateUrl: "./checkbox-group-in-form.example.component.html",
})
export class CheckboxGroupInFormExampleComponent {
    public cabbage = $localize`Cabbage`;
    public potato = $localize`Potato`;
    public tomato = $localize`Tomato`;
    public carrot = $localize`Carrot`;
    public vegetables = [this.cabbage, this.potato, this.tomato, this.carrot];
    public selectedVegetables = [this.cabbage];
    public myForm;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {
        this.myForm = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control(
                [this.cabbage, this.potato],
                [Validators.required, Validators.minLength(3)]
            ),
        });
    }

    public onSubmit(): void {
        console.log(this.myForm);
        this.toastService.success({ message: $localize`Your form is valid!` });
    }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }
}
