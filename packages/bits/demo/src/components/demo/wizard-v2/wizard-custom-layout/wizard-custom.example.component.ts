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

import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// eslint-disable-next-line import/no-deprecated
import { tap } from "rxjs/operators";

import { WizardDirective, WizardStepV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-custom",
    templateUrl: "wizard-custom.component.html",
    styleUrls: ["wizard-custom.component.less"],
    host: {
        class: "nui-wizard-custom-layout",
        "aria-orientation": "horizontal",
    },
    providers: [
        { provide: WizardDirective, useExisting: WizardCustomComponent },
        { provide: CdkStepper, useExisting: WizardCustomComponent },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardCustomComponent extends WizardDirective {}

@Component({
    selector: "nui-wizard-custom-example",
    templateUrl: "./wizard-custom.example.component.html",
    styleUrls: ["wizard-custom.component.less"],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})
export class WizardCustomExampleComponent implements AfterViewInit {
    public form;

    public steps: number = 1;
    public selectedIndex: number = 0;
    public progress: number;

    @ViewChild("wizard") wizard: WizardCustomComponent;

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            personDetails: this.formBuilder.group({
                name: ["", [Validators.required, Validators.minLength(3)]],
                symptoms: [undefined, Validators.required],
            }),
            diseaseDetails: this.formBuilder.group({
                date: ["", Validators.required],
            }),
            contactDetails: this.formBuilder.group({
                email: ["", [Validators.required, Validators.email]],
                phone: [""],
            }),
        });
    }

    public ngAfterViewInit(): void {
        const update = (selectedIndex?: number, steps?: number) => {
            setTimeout(() => {
                if (steps) {
                    this.steps = steps;
                }
                if (selectedIndex !== undefined && selectedIndex >= 0) {
                    this.selectedIndex = selectedIndex;
                }
                this.progress = (100 * (1 + this.selectedIndex)) / this.steps;
            });
        };

        this.wizard.selectionChange
            .pipe(
                tap((i) => {
                    update(i.selectedIndex);
                })
            )
            .subscribe();

        this.wizard.steps.changes
            .pipe(
                tap((c) => {
                    update(undefined, c.length);
                })
            )
            .subscribe();
    }

    validate(step: WizardStepV2Component): void {
        // mark all fields from current step as touched
        // in order to display the validation messages
        Object.keys((step.stepControl as FormGroup)?.controls || {}).forEach(
            (key) => {
                const field = this.wizard.selected.stepControl.get(key);
                field?.markAsTouched();
            }
        );
    }
}
