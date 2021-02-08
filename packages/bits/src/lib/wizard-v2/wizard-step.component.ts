import {AnimationEvent} from "@angular/animations";
import {BooleanInput} from "@angular/cdk/coercion";
import {CdkStep, CdkStepper, StepContentPositionState, StepperOptions, STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    Directive,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    Optional,
    Output,
    QueryList,
    SkipSelf,
    TemplateRef,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {Subject} from "rxjs";
import {distinctUntilChanged, takeUntil} from "rxjs/operators";

import {ErrorStateMatcher} from "./error-state-matcher.provider";
import {WizardStepFooterDirective} from "./wizard-step-footer.directive";
import {WizardStepHeaderComponent} from "./wizard-step-header.component";
import {WizardStepLabelDirective} from "./wizard-step-label.directive";

@Component({
    selector: "nui-wizard-step-v2",
    exportAs: "nuiWizardStep",
    styleUrls: ["wizard-step.component.less"],
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
export class WizardStepV2Component extends CdkStep implements ErrorStateMatcher {
    @Input() template?: TemplateRef<any>;

    /** Content for step label given by `<ng-template wizardStepLabel>`. */
    @ContentChild(WizardStepLabelDirective) stepLabel: WizardStepLabelDirective;

    /** Content for footer given by `<ng-template wizardStepFooter>`. */
    @ContentChild(WizardStepFooterDirective) stepFooter: WizardStepFooterDirective;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(forwardRef(() => CdkStepper)) stepper: any,
        @SkipSelf() private _errorStateMatcher: ErrorStateMatcher,
        @Optional() @Inject(STEPPER_GLOBAL_OPTIONS) stepperOptions?: StepperOptions
    ) {
        super(stepper, stepperOptions);
    }

    /** Custom error state matcher that additionally checks for validity of interacted form. */
    isErrorState(control?: FormControl, form?: FormGroupDirective | NgForm): boolean {
        const originalErrorState = this._errorStateMatcher.isErrorState(control, form);

        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        const customErrorState = !!(control?.invalid && this.interacted);

        return originalErrorState || customErrorState;
    }
}

@Directive({selector: "[nuiWizard]", providers: [{provide: CdkStepper, useExisting: WizardDirective}]})
export class WizardDirective extends CdkStepper implements AfterContentInit {
    static ngAcceptInputTypeEditable: BooleanInput = undefined;
    static ngAcceptInputTypeOptional: BooleanInput = undefined;
    static ngAcceptInputTypeCompleted: BooleanInput = undefined;
    static ngAcceptInputTypeHasError: BooleanInput = undefined;

    /** The list of step headers of the steps in the stepper. */
    @ViewChildren(WizardStepHeaderComponent) _stepHeader: QueryList<WizardStepHeaderComponent>;
    /** Event emitted when the current step is done transitioning in. */
    @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();
    /** Whether ripples should be disabled for the step headers. */
    @Input() disableRipple: boolean;
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

    ngAfterContentInit() {
        // Mark the component for change detection whenever the content children query changes
        this._steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
            this.steps.reset(this._steps as any);
            this._stateChanged();
        });

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
}
