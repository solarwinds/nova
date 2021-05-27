import {Directive, Input, TemplateRef} from "@angular/core";
import {StepState} from "@angular/cdk/stepper";

/** Template context available to an attached `NuiWizardIcon`. */
export interface NuiWizardIconContext {
    index: number;
    active: boolean;
    optional: boolean;
}

export interface MatStepperIconContext {
    index: number;
    active: boolean;
    optional: boolean;
}
/** Template to be used to override the icons inside the step header. */
@Directive({
    selector: "ng-template[nuiWizardIcon]",
})
export class NuiWizardIconDirective {
    /** Name of the icon to be overridden. */
    @Input("nuiWizardIcon") name: StepState;

    constructor(public templateRef: TemplateRef<NuiWizardIconContext>) {}
}
