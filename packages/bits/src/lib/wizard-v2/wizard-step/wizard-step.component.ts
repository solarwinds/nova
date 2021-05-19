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
    Optional,
    SkipSelf,
    TemplateRef,
    ViewEncapsulation,
} from "@angular/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";

import {ErrorStateMatcher} from "../error-state-matcher.provider";
import {WizardStepFooterDirective} from "../wizard-step-footer.directive";
import {WizardStepLabelDirective} from "../wizard-step-label.directive";

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
