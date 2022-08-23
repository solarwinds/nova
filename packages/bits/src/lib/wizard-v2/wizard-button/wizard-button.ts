import { CdkStepperNext, CdkStepperPrevious } from "@angular/cdk/stepper";
import { Directive, Input } from "@angular/core";

/** Button that moves to the next step in a stepper workflow.
 * @ignore
 */
@Directive({
    selector: "button[nuiWizardNext]",
    host: { "[type]": "type" },
})
export class WizardStepperNextDirective extends CdkStepperNext {
    @Input() type: string;
}

/** Button that moves to the previous step in a stepper workflow.
 * @ignore
 */
@Directive({
    selector: "button[nuiWizardPrevious]",
    host: { "[type]": "type" },
})
export class WizardStepperPreviousDirective extends CdkStepperPrevious {
    @Input() type: string;
}
