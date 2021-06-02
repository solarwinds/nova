import {Directive, Input, TemplateRef} from "@angular/core";
import {StepState} from "@angular/cdk/stepper";

/** Template context available to an attached `NuiWizardIcon`. */
export interface NuiWizardIconContext {
    index: number;
    active: boolean;
    optional: boolean;
}

@Directive({
    selector: "ng-template[stepState]",
})
export class WizardIconDirective {

    /** Name of the icon to be overridden. */
    @Input() stepState: StepState;

    constructor(public templateRef: TemplateRef<NuiWizardIconContext>) {}
}
