// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
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

import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";

import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-checkbox-in-form-example",
    templateUrl: "./checkbox-in-form.example.component.html",
})
export class CheckboxInFormExampleComponent implements OnInit {
    public myForm: FormGroup<{ checkbox: FormControl<boolean | null> }>;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {}

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            checkbox: [false, Validators.requiredTrue],
        });
    }

    public onSubmit(): void {
        this.toastService.success({ message: $localize`Your form is valid!` });
    }
}
