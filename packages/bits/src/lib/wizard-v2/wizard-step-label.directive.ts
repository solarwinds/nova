import { CdkStepLabel } from "@angular/cdk/stepper";
import { Directive } from "@angular/core";

@Directive({
    selector: "[nuiWizardStepLabel]",
})
export class WizardStepLabelDirective extends CdkStepLabel {}
