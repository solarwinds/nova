import { Pipe, PipeTransform, QueryList } from "@angular/core";
import { WizardStepV2Component } from "./wizard-step/wizard-step.component";

/**
 * GetWizardStep pipe is used to get the wizard step by index
 *
 * __Parameters :__
 *
 *   index - the index of step
 *
 * __Usage :__
 *   steps | getWizardStep:index
 *
 * __Example :__
 *   <code>{{ steps | getWizardStep:3 }}</code>
 *
 */
@Pipe({
    name: "getWizardStep",
})
export class GetWizardStep implements PipeTransform {
    transform(steps: QueryList<WizardStepV2Component>, index: number): WizardStepV2Component | undefined {
        return steps.get(index);
    }
}
