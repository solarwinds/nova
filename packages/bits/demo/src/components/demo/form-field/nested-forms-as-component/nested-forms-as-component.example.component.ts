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

import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";

import { ToastService } from "@nova-ui/bits";

type NestedFormGroup = FormGroup<{
    nickname: FormControl;
    firstForm?: FirstFormGroup;
    secondForm?: SecondFormGroup;
}>;

type FirstFormGroup = FormGroup<{
    firstName: FormControl;
    lastName: FormControl;
}>;

type SecondFormGroup = FormGroup<{
    city: FormControl;
    address: FormControl;
}>;

@Component({
    selector: "nui-nested-forms-as-component-example",
    templateUrl: "./nested-forms-as-component.example.component.html",
})
export class NestedFormsAsComponentExampleComponent implements OnInit {
    public fancyForm: NestedFormGroup;

    constructor(
        private fb: FormBuilder,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public ngOnInit(): void {
        this.fancyForm = this.fb.group({
            nickname: this.fb.control("", [
                Validators.required,
                Validators.min(3),
            ]),
        });
    }

    public formInitialized(
        name: "firstForm" | "secondForm",
        form: FirstFormGroup | SecondFormGroup
    ): void {
        this.fancyForm.setControl(name, form);
    }

    public onSubmit(value: NestedFormGroup): void {
        this.toastService.success({
            message: `Form is valid: ${value.valid}`,
            title: "Submit",
        });
    }
}

/**
 * Component representing form group for name and surname
 */
@Component({
    selector: "nui-first-custom-form-example",
    template: ` <div [formGroup]="firstForm">
        <nui-form-field
            class="d-block mb-4"
            caption="First Name"
            i18n-caption
            [control]="firstForm.controls['firstName']"
        >
            <nui-textbox formControlName="firstName"></nui-textbox>
            <nui-validation-message for="required" i18n>
                This is required
            </nui-validation-message>
        </nui-form-field>
        <nui-form-field
            class="d-block mb-4"
            caption="Last Name"
            i18n-caption
            [control]="firstForm.controls['lastName']"
        >
            <nui-textbox formControlName="lastName"></nui-textbox>
            <nui-validation-message for="required" i18n>
                This is required
            </nui-validation-message>
        </nui-form-field>
    </div>`,
})
export class FirstCustomFormExampleComponent implements OnInit {
    @Output() formReady = new EventEmitter<FirstFormGroup>();
    public firstForm = this.fb.group({
        firstName: this.fb.control("", Validators.required),
        lastName: this.fb.control("", Validators.required),
    });

    constructor(private fb: FormBuilder) {}

    public ngOnInit(): void {
        this.formReady.emit(this.firstForm);
    }
}

/**
 * Component representing address form group
 */
@Component({
    selector: "nui-second-custom-form-example",
    template: ` <div [formGroup]="secondForm">
        <nui-form-field
            class="d-block mb-4"
            caption="City"
            i18n-caption
            [control]="secondForm.controls['city']"
        >
            <nui-textbox formControlName="city"></nui-textbox>
            <nui-validation-message for="required" i18n>
                This is required
            </nui-validation-message>
        </nui-form-field>
        <nui-form-field
            class="d-block mb-4"
            caption="Address"
            i18n-caption
            [control]="secondForm.controls['address']"
        >
            <nui-textbox formControlName="address"></nui-textbox>
            <nui-validation-message for="required" i18n>
                This is required
            </nui-validation-message>
        </nui-form-field>
    </div>`,
})
export class SecondCustomFormExampleComponent implements OnInit {
    @Output() formReady = new EventEmitter<SecondFormGroup>();
    public secondForm = this.fb.group({
        city: null,
        address: null,
    });

    constructor(private fb: FormBuilder) {}

    public ngOnInit(): void {
        this.formReady.emit(this.secondForm);
    }
}
