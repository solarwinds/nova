import {Directionality} from "@angular/cdk/bidi";
import {BooleanInput} from "@angular/cdk/coercion";
import {CdkStepper} from "@angular/cdk/stepper";
import {DOCUMENT} from "@angular/common";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, Optional, ViewEncapsulation} from "@angular/core";

import {wizardAnimations} from "../wizard-animations/wizard-animations";
import { WizardDirective } from "../wizard.directive";

@Component({
    selector: "nui-wizard-vertical",
    exportAs: "wizardVertical",
    templateUrl: "wizard-vertical.component.html",
    styleUrls: ["../wizard.component.less"],
    host: {
        "class": "nui-wizard-vertical-layout",
        "aria-orientation": "vertical",
        "role": "tablist",
    },
    animations: [wizardAnimations.verticalStepTransition],
    providers: [
        {provide: WizardDirective, useExisting: WizardVerticalComponent},
        {provide: CdkStepper, useExisting: WizardVerticalComponent},
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardVerticalComponent extends WizardDirective {
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

    constructor(
        @Optional() dir: Directionality,
                    changeDetectorRef: ChangeDetectorRef,
            // @breaking-change 8.0.0 `elementRef` and `_document` parameters to become required.
                    elementRef?: ElementRef<HTMLElement>,
        @Inject(DOCUMENT) _document?: any) {
        super(dir, changeDetectorRef, elementRef, _document);
        this._orientation = "vertical";
    }
}
