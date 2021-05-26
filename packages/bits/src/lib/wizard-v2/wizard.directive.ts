import {
    AfterContentInit,
    AfterViewInit,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    QueryList,
    ViewChildren,
} from "@angular/core";
import { CdkStepper, StepContentPositionState, StepperSelectionEvent } from "@angular/cdk/stepper";
import { BooleanInput } from "@angular/cdk/coercion";
import { WizardStepHeaderComponent } from "./wizard-step-header/wizard-step-header.component";
import { Subject } from "rxjs";
import { AnimationEvent } from "@angular/animations";
import { distinctUntilChanged, startWith, takeUntil } from "rxjs/operators";
import { WizardStepV2Component } from "./wizard-step/wizard-step.component";

@Directive({selector: "[nuiWizard]", providers: [{provide: CdkStepper, useExisting: WizardDirective}]})
export class WizardDirective extends CdkStepper implements AfterContentInit, AfterViewInit, OnDestroy {
    static ngAcceptInputTypeEditable: BooleanInput = undefined;
    static ngAcceptInputTypeOptional: BooleanInput = undefined;
    static ngAcceptInputTypeCompleted: BooleanInput = undefined;
    static ngAcceptInputTypeHasError: BooleanInput = undefined;

    /** Override CdkStepper 'steps' property to use WizardStepV2Component instead of CdkStep */
    readonly steps: QueryList<WizardStepV2Component> = new QueryList<WizardStepV2Component>();

    /** The list of step headers of the steps in the stepper. */
    @ViewChildren(WizardStepHeaderComponent) _stepHeader: QueryList<WizardStepHeaderComponent>;
    /** Event emitted when the current step is done transitioning in. */
    @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();
    /** Event emitted when the selected step has changed. */
    @Output() readonly selectionChange = new EventEmitter<StepperSelectionEvent>();
    /** Emit steps for ability restore them status later */
    @Output() readonly wizardStepsStatusChanges: EventEmitter<QueryList<WizardStepV2Component>> = new EventEmitter();
    /** Whether ripples should be disabled for the step headers. */
    @Input() disableRipple: boolean;
    /** Steps used for restoring wizard state */
    @Input() stepsToRestore: QueryList<WizardStepV2Component>;
    /** Stream of animation `done` events when the body expands/collapses. */
    _animationDone = new Subject<AnimationEvent>();

    /** Steps that the stepper holds. */
    @ContentChildren(WizardStepV2Component, {descendants: true}) _steps: QueryList<WizardStepV2Component>;

    /** The step that is selected. */
    @Input()
    get selected(): WizardStepV2Component {
        return this.steps.toArray()[this.selectedIndex] as WizardStepV2Component;
    }

    set selected(step: WizardStepV2Component) {
        this.selectedIndex = this.steps ? this.steps.toArray().indexOf(step) : -1;
    }

    public ngAfterContentInit(): void {
        this._steps.changes
            .pipe(startWith(this._steps), takeUntil(this._destroyed))
            .subscribe((steps: QueryList<WizardStepV2Component>) => {
                this.steps.reset(steps.filter(step => step._stepper === this));
                this.steps.notifyOnChanges();
            });
        this.steps.changes.pipe(takeUntil(this._destroyed))
            .subscribe(() => this._stateChanged());
        this._animationDone.pipe(
            // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
            // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
            // See https://github.com/angular/angular/issues/24084
            distinctUntilChanged((x, y) => x.fromState === y.fromState && x.toState === y.toState),
            takeUntil(this._destroyed)
        ).subscribe(event => {
            if ((event.toState as StepContentPositionState) === "current") {
                this.animationDone.emit();
            }
        });
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (this.stepsToRestore) {
            this.restoreStepsState();
        }
    }

    public ngOnDestroy(): void {
        this.wizardStepsStatusChanges.emit(this.steps);
        super.ngOnDestroy();
    }

    public restoreStepsState(): void {
        const completed: WizardStepV2Component[] = [];

        this.stepsToRestore.forEach((step, index) => {
            const stepToRestore = this.steps.get(index);

            if (stepToRestore && step.completed) {
                stepToRestore.completed = step.completed;
                completed.push(stepToRestore);
            }
        });

        const len = completed.length;

        if (len) {
            completed[len - 1].select();
        }

        this["_changeDetectorRef"].detectChanges();
    }
}
