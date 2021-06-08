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
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";

import {WizardStepLabelDirective} from "../wizard-step-label.directive";
import { WIZARD_CONFIG, WIZARD_CONFIG_DEFAULT } from "../../../constants";
import { IWizardConfig, IWizardStepStateIconConfig } from "../types";

interface IWizardCurrentStepStatusIconConfig {
    icon: string | undefined;
    color: string | undefined;
}

@Component({
    selector: "nui-wizard-step-header",
    templateUrl: "wizard-step-header.component.html",
    styleUrls: ["wizard-step-header.component.less"],
    host: {
        "class": "nui-wizard-step-header mat-focus-indicator",
        "[class.nui-wizard-step-header--selected]": "selected",
        "[class.nui-wizard-step-header--optional]": "optional",
        "[class.nui-wizard-step-header--completed]": "stepState === 'done'",
        "[class.nui-wizard-step-header--disabled]": "!completed",
        "role": "tab",
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardStepHeaderComponent extends CdkStepHeader implements AfterViewInit, OnDestroy, OnChanges {
    /** State of the given step. */
    @Input() stepState: StepState;

    /** Custom icon config received from the wizard step. Allows to customize state icons for a particular wizard step */
    @Input() stepIconsConfig: Partial<IWizardStepStateIconConfig>;

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

    private wizardConfig: Partial<IWizardConfig> = {...WIZARD_CONFIG_DEFAULT};

    constructor(
        private _focusMonitor: FocusMonitor,
        _elementRef: ElementRef<HTMLElement>,
        @Optional() @Inject(WIZARD_CONFIG) public readonly config?: IWizardConfig
    ) {
        super(_elementRef);

        if (this.config) {
            this.updateIconsConfig(this.config.stepStateIcons);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.stepIconsConfig?.currentValue) {
            this.updateIconsConfig(changes?.stepIconsConfig?.currentValue);
        }
    }

    ngAfterViewInit(): void {
        this._focusMonitor.monitor(this._elementRef, true);
    }

    ngOnDestroy(): void {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Focuses the step header. */
    public focus(): void {
        this._focusMonitor.focusVia(this._elementRef, "program");
    }

    /** Returns string label of given step if it is a text label. */
    public get stringLabel(): string | null {
        return this.label instanceof WizardStepLabelDirective ? null : this.label;
    }

    /** Returns WizardStepLabel if the label of given step is a template label. */
    public get templateLabel(): WizardStepLabelDirective | null {
        return this.label instanceof WizardStepLabelDirective ? this.label : null;
    }

    public get currentStepStateIconConfig(): IWizardCurrentStepStatusIconConfig | undefined {

        if (this.stepState === "number") {
            return {
                icon: this.wizardConfig.stepStateIcons?.icons?.initial,
                color: this.wizardConfig.stepStateIcons?.colors?.initial,
            };
        }
        
        if (this.stepState === "done") {
            return {
                icon: this.wizardConfig.stepStateIcons?.icons?.visited,
                color: this.wizardConfig.stepStateIcons?.colors?.visited,
            };
        }
        
        if (this.stepState === "edit") {
            return {
                icon: this.wizardConfig.stepStateIcons?.icons?.active,
                color: this.wizardConfig.stepStateIcons?.colors?.active,
            };
        }
        
        if (this.stepState === "error") {
            return {
                icon: this.wizardConfig.stepStateIcons?.icons?.error,
                color: this.wizardConfig.stepStateIcons?.colors?.error,
            };
        }
    }

    private updateIconsConfig(iconConfig: Partial<IWizardStepStateIconConfig> ) {

        this.wizardConfig.stepStateIcons = {
            icons: {
                ...this.wizardConfig.stepStateIcons?.icons,
                ...iconConfig?.icons,
            },
            colors: {
                ...this.wizardConfig.stepStateIcons?.colors,
                ...iconConfig?.colors,
            },
        }
    }
}
