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

import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-reactive-form",
    templateUrl: "./combobox-reactive-form.example.component.html",
})
export class ComboboxReactiveFormExampleComponent implements OnInit, OnDestroy {
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "Item 2",
    };
    public myForm;
    destroy$$ = new Subject<void>();

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
        this.myForm.controls.item.valueChanges
            .pipe(takeUntil(this.destroy$$))
            .subscribe((value) => console.log(value));
    }

    public ngOnDestroy(): void {
        this.destroy$$.next();
        this.destroy$$.complete();
    }

    public onSubmit(): void {
        this.myForm.valid
            ? this.toastService.success({ message: "Your form is valid!" })
            : this.toastService.error({ message: `Your form is invalid!` });
    }
}
