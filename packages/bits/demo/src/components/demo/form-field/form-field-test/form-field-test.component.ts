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

import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import moment from "moment/moment";

@Component({
    selector: "nui-form-field-test",
    templateUrl: "./form-field-test.component.html",
})
export class FormFieldTestComponent implements OnInit {
    public dynamicForm;

    public dateTimePickerModel: string;
    public vegetables = [
        $localize`Cabbage`,
        $localize`Potato`,
        $localize`Tomato`,
        $localize`Carrot`,
    ];

    constructor(private formBuilder: FormBuilder) {
        this.dynamicForm = this.formBuilder.group({
            textbox: this.formBuilder.control("", Validators.required),
            textboxNumber: this.formBuilder.control("", Validators.required),
            radio: this.formBuilder.control({}, Validators.required),
            checkbox: this.formBuilder.control(true, Validators.required),
            checkboxGroup: this.formBuilder.control("", Validators.required),
            switch: this.formBuilder.control(true, Validators.required),
            selectV2: this.formBuilder.control("apple", Validators.required),
            comboboxV2: this.formBuilder.control("apple", Validators.required),
            datepicker: this.formBuilder.control(moment(), Validators.required),
            timepicker: this.formBuilder.control({}, Validators.required),
            dateTimePicker: this.formBuilder.control(
                moment("04/09/1989", "L"),
                [
                    // "L" is "MM/DD/YYY" in moment.js
                    Validators.required,
                ]
            ),
        });
    }

    public ngOnInit(): void {
        this.dynamicForm.disable();
        this.dynamicForm.valueChanges.subscribe(
            (value) =>
                (this.dateTimePickerModel = moment(value.dateTimePicker).format(
                    "LLLL"
                ))
        );
    }

    public toggleDisabledState(): void {
        if (this.dynamicForm.disabled) {
            this.dynamicForm.enable();
        } else {
            this.dynamicForm.disable();
        }
    }
}
