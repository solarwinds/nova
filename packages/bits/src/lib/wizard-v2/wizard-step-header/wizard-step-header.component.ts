import { FocusMonitor } from "@angular/cdk/a11y";
import { CdkStepHeader, StepState, STEP_STATE } from "@angular/cdk/stepper";
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

import { WizardStepLabelDirective } from "../wizard-step-label.directive";
import { WIZARD_CONFIG, WIZARD_CONFIG_DEFAULT } from "../../../constants/wizard.constants";
import { IWizardConfig, WizardStepStateConfig } from "../types";
import assign from "lodash/assign";

@Component({
    selector: "nui-wizard-step-header",
    templateUrl: "wizard-step-header.component.html",
    styleUrls: ["wizard-step-header.component.less"],
    host: {
        "class": "nui-wizard-step-header",
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
    @Input() stepStateConfig: Partial<WizardStepStateConfig>;

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

    public stepStateConfigMap: WizardStepStateConfig;

    private wizardConfig: IWizardConfig = {...WIZARD_CONFIG_DEFAULT};

    constructor(
        private _focusMonitor: FocusMonitor,
        _elementRef: ElementRef<HTMLElement>,
        @Optional() @Inject(WIZARD_CONFIG) public readonly config?: IWizardConfig
    ) {
        super(_elementRef);

        if (this.config) {
            this.updateStepStateConfig(this.config.stepState);
        }

        this.createStepStateConfigMap();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.stepStateConfig?.currentValue) {
            this.updateStepStateConfig(changes?.stepStateConfig?.currentValue);
            this.createStepStateConfigMap();
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

    private updateStepStateConfig(stepStateConfig: WizardStepStateConfig) {
        this.wizardConfig.stepState = assign({...this.wizardConfig.stepState}, stepStateConfig);
    }

    private createStepStateConfigMap() {
        this.stepStateConfigMap = {
            [STEP_STATE.NUMBER]: this.wizardConfig.stepState?.initial,
            [STEP_STATE.DONE]: this.wizardConfig.stepState?.visited,
            [STEP_STATE.EDIT]: this.wizardConfig.stepState?.active,
            [STEP_STATE.ERROR]: this.wizardConfig.stepState?.error,
        }
    }
}
