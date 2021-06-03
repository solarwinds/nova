import {FocusMonitor} from "@angular/cdk/a11y";
import {CdkStepHeader, StepState} from "@angular/cdk/stepper";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    SkipSelf,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";

import {WizardStepLabelDirective} from "../wizard-step-label.directive";
import {IWizardIcons} from "../wizard.directive";
import {wizardIconsPresetToken} from "../../../constants";

@Component({
    selector: "wizard-step-header",
    templateUrl: "wizard-step-header.component.html",
    styleUrls: ["wizard-step-header.component.less"],
    host: {
        "class": "nui-wizard-step-header mat-focus-indicator",
        "[class.nui-wizard-step-header--selected]": "selected",
        "[class.nui-wizard-step-header--optional]": "optional",
        "[class.nui-wizard-step-header--completed]": "state == 'done'",
        "[class.nui-wizard-step-header--disabled]": "!completed",
        "role": "tab",
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardStepHeaderComponent extends CdkStepHeader implements AfterViewInit, OnDestroy, OnChanges {
    public icons: IWizardIcons = {
        initial: "step",
        visited: "step-complete",
        selected: "step-active",
        error: "severity_error",
    };
    public iconColor: string;

    /** State of the given step. */
    @Input() state: StepState;

    /** Set custom initial icon for the given step. */
    @Input() stepIcon: string;

    /** Set custom icons for the given step. */
    @Input() customIcons: Partial<IWizardIcons>;

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

    /** Whether the given step is completed. */
    @Input() completed: boolean;

    /** Whether the given step label is active. */
    @Input() active: boolean;

    /** Whether the given step is optional. */
    @Input() optional: boolean;
    /** Whether the ripple should be disabled. */
    @Input() disableRipple: boolean;

    constructor(
        private _focusMonitor: FocusMonitor,
        _elementRef: ElementRef<HTMLElement>,
        @SkipSelf() @Optional() @Inject(wizardIconsPresetToken) private injectedIcons: IWizardIcons
    ) {
        super(_elementRef);
        if (injectedIcons) {
            this.icons = this.getIconsForStates(this.icons, injectedIcons);
        }

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.customIcons) {
            this.icons = this.getIconsForStates(this.icons, changes.customIcons.currentValue);
        }
    }

    ngAfterViewInit(): void {
        this._focusMonitor.monitor(this._elementRef, true);
    }

    ngOnDestroy(): void {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Focuses the step header. */
    focus(): void {
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

    private getIconsForStates(icons: IWizardIcons, customIcons: IWizardIcons): IWizardIcons {
        const stepIcons = icons;
        if (customIcons) {
            Object.keys(customIcons).forEach(icon => {
                stepIcons[icon] = customIcons[icon];
            });
        }

        return stepIcons
    }

    _getDefaultIconForState(state: StepState): string {
        let returnedState: StepState = state;

        if (state === "number") {
            returnedState = this.stepIcon || this.icons.initial;
            this.iconColor = "gray";
        } else if (state === "done") {
            returnedState = this.icons.visited;
            this.iconColor = "primary-blue";
        } else if (state === "edit") {
            returnedState = this.icons.selected;
            this.iconColor = "black";
        } else if (state === "error") {
            returnedState = this.icons.error;
            this.iconColor = "red";
        }

        return returnedState;
    }

}
