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

import { Inject, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Moment } from "moment/moment";

import { ToastService } from "../../toast/toast.service";

/**
 * @ignore
 */
@Component({
    template: `
        <form [formGroup]="myForm" (submit)="onSubmit()">
            <div class="form-group">
                <nui-time-picker
                    formControlName="testTime"
                    [isInErrorState]="
                        myForm.controls['testTime'].invalid &&
                        myForm.controls['testTime'].touched
                    "
                    (timeChanged)="valueChange($event)"
                ></nui-time-picker>
                <button nui-button type="submit" class="mt-1">Submit</button>
            </div>
        </form>
    `,
})
export class TimePickerReactiveFormTestComponent implements OnInit {
    public time: Moment;
    public myForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) public toastService: ToastService
    ) {}

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            testTimePicker: this.formBuilder.control(this.time, [
                Validators.required,
            ]),
        });
    }

    public valueChange(time: any): void {
        this.time = time;
    }

    public onSubmit() {
        this.myForm.valid
            ? this.toastService.success({ message: "Your form is valid!" })
            : this.toastService.error({ message: "Your form is invalid!" });
    }
}
