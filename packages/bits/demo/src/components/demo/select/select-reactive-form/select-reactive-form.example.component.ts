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
import { FormBuilder, Validators } from "@angular/forms";

import { ISelectChangedEvent, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-select-reactive-form",
    templateUrl: "./select-reactive-form.example.component.html",
})
export class SelectReactiveFormExampleComponent implements OnInit {
    public dataset = {
        items: [
            $localize`Item 1`,
            $localize`Item 2`,
            $localize`Item 3`,
            $localize`Item 4`,
            $localize`Item 5`,
        ],
        selectedItem: "",
    };
    public myForm;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService
    ) {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(this.dataset.selectedItem, [
                Validators.required,
            ]),
        });
    }

    public ngOnInit(): void {
        this.myForm.controls["item"].valueChanges.subscribe((value) =>
            console.log("Value changed to", value)
        );
    }

    public valueChange(changedEvent: ISelectChangedEvent<string>): void {
        this.dataset.selectedItem = changedEvent.newValue;
    }

    public onSubmit(): void {
        if (this.myForm.valid) {
            this.toastService.success({
                message: $localize`Your form is valid!`,
            });
        } else {
            // if form is invalid mark all controls as touched to trigger isInErrorState
            Object.keys(this.myForm.controls).forEach((field) => {
                const control = this.myForm.get(field);
                control?.markAsTouched({ onlySelf: true });
            });
            this.toastService.error({
                message: $localize`Your form is invalid!`,
            });
        }
    }
}
