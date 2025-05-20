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

import {
    CdkStep,
    CdkStepper,
    StepperOptions,
    STEPPER_GLOBAL_OPTIONS,
} from "@angular/cdk/stepper";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    SkipSelf,
    TemplateRef,
    ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ErrorStateMatcher } from "../error-state-matcher.provider";
import { WizardStepStateConfig } from "../types";
import { WizardStepFooterDirective } from "../wizard-step-footer.directive";
import { WizardStepLabelDirective } from "../wizard-step-label.directive";

/** @ignore */
@Component({
    selector: "nui-wizard-step-v2",
    exportAs: "nuiWizardStep",
    template: `
        <ng-template>
            <ng-content *ngIf="!template"></ng-content>
            <ng-container *ngIf="template">
                <ng-container *ngTemplateOutlet="template"></ng-container>
            </ng-container>
        </ng-template>
    `,
    providers: [
        { provide: ErrorStateMatcher, useExisting: WizardStepV2Component },
        { provide: CdkStep, useExisting: WizardStepV2Component },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardStepV2Component
    extends CdkStep
    implements OnInit, OnDestroy, ErrorStateMatcher
{
    @Input() template?: TemplateRef<any>;

    @Input() stepStateConfig: Partial<WizardStepStateConfig>;

    @Input() stepIndex: number;

    /** Content for step label given by `<ng-template wizardStepLabel>`. */
    @ContentChild(WizardStepLabelDirective)
    declare stepLabel: WizardStepLabelDirective;

    /** Content for footer given by `<ng-template wizardStepFooter>`. */
    @ContentChild(WizardStepFooterDirective)
    stepFooter: WizardStepFooterDirective;

    private readonly destroy$ = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(forwardRef(() => CdkStepper)) stepper: any,
        @SkipSelf() private _errorStateMatcher: ErrorStateMatcher,
        @Optional()
        @Inject(STEPPER_GLOBAL_OPTIONS)
        stepperOptions?: StepperOptions
    ) {
        super(stepper, stepperOptions);
    }

    public ngOnInit(): void {
        this.onControlStatusChanges();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** Custom error state matcher that additionally checks for validity of interacted form. */
    public isErrorState(
        control?: FormControl,
        form?: FormGroupDirective | NgForm
    ): boolean {
        const originalErrorState = this._errorStateMatcher.isErrorState(
            control,
            form
        );

        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        const customErrorState = !!(control?.invalid && this.interacted);

        return originalErrorState || customErrorState;
    }

    private onControlStatusChanges(): void {
        if (this.stepControl) {
            this.stepControl.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((status) => {
                    if (status === "INVALID") {
                        this.completed = false;
                    }

                    if (status === "VALID") {
                        this.completed = true;
                    }
                });
        }
    }
}
