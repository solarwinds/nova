import {BooleanInput} from "@angular/cdk/coercion";
import {CdkStepper} from "@angular/cdk/stepper";
import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from "@angular/core";

import {wizardAnimations} from "../wizard-animations/wizard-animations";
import { WizardDirective } from "../wizard.directive";

@Component({
    selector: "nui-wizard-horizontal",
    exportAs: "wizardHorizontal",
    templateUrl: "wizard-horizontal.component.html",
    styleUrls: ["../wizard.component.less"],
    host: {
        "class": "nui-wizard-horizontal-layout",
        "[class.nui-wizard-step-header__label-position--end]": "labelPosition == 'end'",
        "[class.nui-wizard-step-header__label-position--top]": "labelPosition == 'top'",
        "aria-orientation": "horizontal",
        "role": "tablist",
    },
    animations: [wizardAnimations.horizontalStepTransition],
    providers: [
        {provide: WizardDirective, useExisting: WizardHorizontalComponent},
        {provide: CdkStepper, useExisting: WizardHorizontalComponent},
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardHorizontalComponent extends WizardDirective implements OnInit {
    static ngAcceptInputTypeEditable: BooleanInput = undefined;
    static ngAcceptInputTypeOptional: BooleanInput = undefined;
    static ngAcceptInputTypeCompleted: BooleanInput = undefined;
    static ngAcceptInputTypeHasError: BooleanInput = undefined;

    public get selectedIndex(): number {
        return super.selectedIndex;
    }
    @Input()
    public set selectedIndex(value: number) {
        super.selectedIndex = value;
    }

    /** Whether the label should display in bottom or end position. */
    @Input() labelPosition: "top" | "end" = "top";
    

    ngOnInit(): void {
        // Checking the validity of previous steps by default.
        this.linear = true;
    }
}
