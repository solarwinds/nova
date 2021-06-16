import { Pipe, PipeTransform, QueryList } from "@angular/core";
import { WizardStepV2Component } from "../lib/wizard-v2/wizard-step/wizard-step.component";


/**
 * GetStep pipe is used to get the wizard step by index
 *
 * __Parameters :__
 *
 *   index - the index of step
 *
 * __Usage :__
 *   steps | getStep:index
 *
 * __Example :__
 *   <code>{{ steps | getStep:3 }}</code>
 *
 */
@Pipe({
    name: "getStep",
})
export class GetStep implements PipeTransform {
    transform(steps: QueryList<WizardStepV2Component>, index: number): WizardStepV2Component | undefined {
        return steps.get(index);
    }
}
