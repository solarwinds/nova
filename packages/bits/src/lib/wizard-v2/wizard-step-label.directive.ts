import {CdkStepLabel} from "@angular/cdk/stepper";
import {Directive} from "@angular/core";

@Directive({
  selector: "[wizardStepLabel]",
})
export class WizardStepLabelDirective extends CdkStepLabel {}
