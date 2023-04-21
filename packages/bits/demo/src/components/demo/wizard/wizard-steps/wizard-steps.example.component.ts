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

import { Component, OnDestroy, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    IWizardSelectionEvent,
    WizardComponent,
    WizardStepComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-steps-example",
    templateUrl: "./wizard-steps.example.component.html",
})
export class WizardStepsExampleComponent implements OnDestroy {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("dynamicStep") dynamicStep: WizardStepComponent;

    public selectedIndex: number;
    public myForm;
    private readonly destroy$ = new Subject<void>();

    constructor(private formBuilder: FormBuilder) {
        this.myForm = this.formBuilder.group({
            name: ["", Validators.required],
            email: [
                "",
                [
                    Validators.required,
                    Validators.pattern("[^ @]*@[^ @]*"),
                    Validators.email,
                ],
            ],
            password: ["", [Validators.required, Validators.minLength(8)]],
        });
    }

    public select(event: IWizardSelectionEvent): void {
        this.selectedIndex = event.selectedIndex;
    }

    public addStep(): void {
        // addStepDynamic returns an instance of WizardStepComponent that was dynamically added
        const step = this.wizardComponent.addStepDynamic(
            this.dynamicStep,
            this.selectedIndex + 1
        );

        step.enter
            ?.pipe(takeUntil(this.destroy$))
            .subscribe(() =>
                console.log(
                    `Enter event has been emitted from WizardStepComponent`
                )
            );

        step.exit
            ?.pipe(takeUntil(this.destroy$))
            .subscribe(() =>
                console.log(
                    `Exit event has been emitted from WizardStepComponent`
                )
            );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
