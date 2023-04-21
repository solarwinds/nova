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

import { AnimationEvent } from "@angular/animations";
import { BooleanInput } from "@angular/cdk/coercion";
import {
    CdkStepper,
    StepContentPositionState,
    StepperSelectionEvent,
} from "@angular/cdk/stepper";
import {
    AfterContentInit,
    AfterViewInit,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from "@angular/core";
import { Subject } from "rxjs";
import { distinctUntilChanged, startWith, takeUntil } from "rxjs/operators";

import { IWizardState } from "./types";
import { WizardStepHeaderComponent } from "./wizard-step-header/wizard-step-header.component";
import { WizardStepV2Component } from "./wizard-step/wizard-step.component";

@Directive({
    selector: "[nuiWizard]",
    providers: [{ provide: CdkStepper, useExisting: WizardDirective }],
})
export class WizardDirective
    extends CdkStepper
    implements OnChanges, AfterContentInit, AfterViewInit, OnDestroy
{
    static ngAcceptInputTypeEditable: BooleanInput = undefined;
    static ngAcceptInputTypeOptional: BooleanInput = undefined;
    static ngAcceptInputTypeCompleted: BooleanInput = undefined;
    static ngAcceptInputTypeHasError: BooleanInput = undefined;

    /** Override CdkStepper 'steps' property to use WizardStepV2Component instead of CdkStep */
    readonly steps: QueryList<WizardStepV2Component> =
        new QueryList<WizardStepV2Component>();

    stepsArray: Array<WizardStepV2Component> = [];

    /** Uniq labels ids */
    public labelIds: string[];

    /** Uniq step content ids */
    public stepContentIds: string[];

    /** Event emitted when the current step is done transitioning in. */
    @Output() readonly animationDone: EventEmitter<void> =
        new EventEmitter<void>();
    /** Event emitted when the selected step has changed. */
    @Output() readonly selectionChange =
        new EventEmitter<StepperSelectionEvent>();

    /** The state of the wizard */
    @Input() state: IWizardState;

    /** Emits the completed wizard state on component destroy */
    @Output() readonly finished: EventEmitter<IWizardState> =
        new EventEmitter<IWizardState>();

    /** The list of step headers of the steps in the stepper. */
    @ViewChildren(WizardStepHeaderComponent)
    declare _stepHeader: QueryList<WizardStepHeaderComponent>;

    /** Stream of animation `done` events when the body expands/collapses. */
    _animationDone = new Subject<AnimationEvent>();

    /** Steps that the stepper holds. */
    @ContentChildren(WizardStepV2Component, { descendants: true })
    declare _steps: QueryList<WizardStepV2Component>;

    /** The step that is selected. */
    @Input()
    get selected(): WizardStepV2Component {
        return this.steps.toArray()[
            this.selectedIndex
        ] as WizardStepV2Component;
    }

    set selected(step: WizardStepV2Component) {
        this.selectedIndex = this.steps
            ? this.steps.toArray().indexOf(step)
            : -1;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.state && changes.state.currentValue) {
            this.state = changes.state.currentValue;
        }
    }

    public ngAfterContentInit(): void {
        this._steps.changes
            .pipe(startWith(this._steps), takeUntil(this._destroyed))
            .subscribe((steps: QueryList<WizardStepV2Component>) => {
                this.steps.reset(
                    steps.filter((step) => step._stepper === this)
                );
                this.stepsArray = this.steps.toArray();
                this.steps.notifyOnChanges();
                this.setIds();
            });

        this.steps.changes
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this._stateChanged());

        this._animationDone
            .pipe(
                // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
                // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
                // See https://github.com/angular/angular/issues/24084
                distinctUntilChanged(
                    (x, y) =>
                        x.fromState === y.fromState && x.toState === y.toState
                ),
                takeUntil(this._destroyed)
            )
            .subscribe((event) => {
                if ((event.toState as StepContentPositionState) === "current") {
                    this.animationDone.emit();
                }
            });
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (this.state?.finished) {
            this.restore();
        }
    }

    public ngOnDestroy(): void {
        this.finished.emit({
            finished: this.allStepsCompleted,
        });
        super.ngOnDestroy();
    }

    public get allStepsCompleted(): boolean {
        const completed: boolean = this.steps
            .toArray()
            .reduce(
                (acc: boolean, step: WizardStepV2Component) =>
                    acc && step.completed,
                true
            );

        return completed;
    }

    // Restores the completed wizard to the last step
    private restore(): void {
        this.steps.toArray().forEach((step) => {
            step.completed = true;

            if (step === this.steps.last) {
                step.select();
            }
        });

        this["_changeDetectorRef"].detectChanges();
    }

    private setIds(): void {
        this.labelIds = this.stepsArray.map((step, index) =>
            this._getStepLabelId(index)
        );
        this.stepContentIds = this.stepsArray.map((step, index) =>
            this._getStepContentId(index)
        );
    }
}
