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

import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-reactive-form",
    templateUrl: "./combobox-reactive-form.example.component.html",
})
export class ComboboxReactiveFormExampleComponent implements OnInit {
    public myForm: FormGroup;
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "Item 2",
    };

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(this.dataset.selectedItem, [
                Validators.required,
            ]),
        });

        this.myForm.controls["item"].valueChanges.subscribe((value) =>
            console.log(value)
        );
    }

    public onSubmit() {
        this.myForm.valid
            ? this.toastService.success({ message: "Your form is valid!" })
            : this.toastService.error({ message: `Your form is invalid!` });
    }
}
