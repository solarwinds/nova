import {FocusMonitor} from "@angular/cdk/a11y";
import {CdkStepHeader, StepState} from "@angular/cdk/stepper";
import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewEncapsulation,
} from "@angular/core";

import {WizardStepLabelDirective} from "../wizard-step-label.directive";

@Component({
    selector: "wizard-step-header",
    templateUrl: "wizard-step-header.component.html",
    styleUrls: ["wizard-step-header.component.less"],
    host: {
        "class": "nui-wizard-step-header mat-focus-indicator",
        "[class.nui-wizard-step-header-selected]": "selected",
        "[class.nui-wizard-step-header-active]": "active",
        "[class.nui-wizard-step-header-optional]": "optional",
        "[class.nui-wizard-step-header-completed]": "state == 'done'",
        "role": "tab",
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardStepHeaderComponent extends CdkStepHeader implements AfterViewInit, OnDestroy {
    /** State of the given step. */
    @Input() state: StepState;

    /** Label of the given step. */
    @Input() label: WizardStepLabelDirective | string;

    /** Label that is rendered below optional steps. */
    @Input() optionalLabel: string = $localize `Optional`;

    /** Error message to display when there's an error. */
    @Input() errorMessage: string;

    /** Index of the given step. */
    @Input() index: number;

    /** Whether the given step is selected. */
    @Input() selected: boolean;

    /** Whether the given step label is active. */
    @Input() active: boolean;

    /** Whether the given step is optional. */
    @Input() optional: boolean;

    /** Whether the ripple should be disabled. */
    @Input() disableRipple: boolean;

    constructor(
        private _focusMonitor: FocusMonitor,
        _elementRef: ElementRef<HTMLElement>
    ) {
        super(_elementRef);
    }

    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Focuses the step header. */
    focus() {
        this._focusMonitor.focusVia(this._elementRef, "program");
    }

    /** Returns string label of given step if it is a text label. */
    _stringLabel(): string | null {
        return this.label instanceof WizardStepLabelDirective ? null : this.label;
    }

    /** Returns WizardStepLabel if the label of given step is a template label. */
    _templateLabel(): WizardStepLabelDirective | null {
        return this.label instanceof WizardStepLabelDirective ? this.label : null;
    }

    _getDefaultTextForState(state: StepState): string {
        let returnedState: StepState = state;

        switch (state) {
            case "number":
                returnedState = `${this.index + 1}`;
                break;

            case "edit":
                returnedState = "create";
                break;

            case "error":
                returnedState = "warning";
                break;

            default:
        }

        return returnedState;
    }

    _getDefaultIconForState(state: StepState): string {
        let returnedState: StepState = state;

        switch (state) {
            case "number":
            case "done": returnedState = "step-complete"; break;
            case "edit": returnedState = "edit"; break;
            case "error": returnedState = "warning"; break;
            default:
        }

        return returnedState;
    }

}
