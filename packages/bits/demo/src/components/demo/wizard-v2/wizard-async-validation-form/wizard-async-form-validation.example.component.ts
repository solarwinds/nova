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

import { Component, OnInit, ViewChild } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { of } from "rxjs";
import { delay, take } from "rxjs/operators";

import {
    ToastService,
    WizardHorizontalComponent,
    WizardStepV2Component,
} from "@nova-ui/bits";

const fakeAsyncValidator = (c: FormControl) => of(null).pipe(delay(4000));

@Component({
    selector: "nui-wizard-async-form-validation-example",
    templateUrl: "./wizard-async-form-validation.example.component.html",
})
export class WizardAsyncFormValidationExampleComponent implements OnInit {
    public busy: boolean;
    public form: FormGroup;

    @ViewChild("wizard") wizard: WizardHorizontalComponent;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {}

    public ngOnInit(): void {
        this.form = new FormGroup({
            personDetails: this.formBuilder.group({
                name: [
                    "",
                    [Validators.required, Validators.minLength(3)],
                    [fakeAsyncValidator],
                ],
            }),
            contactDetails: this.formBuilder.group({
                email: ["", [Validators.required, Validators.email]],
                phone: [""],
            }),
        });
    }

    public onNextClick(selected: WizardStepV2Component): void {
        const { stepControl } = selected;

        if (stepControl.status !== "PENDING") {
            stepControl.markAllAsTouched();

            return;
        }

        this.busy = true;
        stepControl.statusChanges.pipe(take(1)).subscribe((status) => {
            if (status === "VALID") {
                this.wizard.next();
                this.busy = false;
            }
        });
    }

    public finishWizard(): void {
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Wizard was completed successfully`,
            options: {
                timeOut: 2000,
            },
        });
    }

    public resetWizard(): void {
        this.wizard.reset();
    }
}
