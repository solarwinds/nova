// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
  input
} from "@angular/core";
import assign from "lodash/assign";

import {
    WIZARD_CONFIG,
    WIZARD_CONFIG_DEFAULT,
} from "../../../constants/wizard.constants";
import { IWizardConfig, WizardStepStateConfig } from "../types";
import { WizardStepV2Component } from "../wizard-step/wizard-step.component";
import { WizardStepLabelDirective } from "../wizard-step-label.directive";

/** @ignore */
@Component({
    selector: "nui-wizard-step-header",
    templateUrl: "wizard-step-header.component.html",
    styleUrls: ["wizard-step-header.component.less"],
    host: {
        class: "nui-wizard-step-header",
        "[class.nui-wizard-step-header--selected]": "selected",
        "[class.nui-wizard-step-header--optional]": "step.optional",
        "[class.nui-wizard-step-header--completed]": "stepState === 'done'",
        role: "tab",
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class WizardStepHeaderComponent
    extends CdkStepHeader
    implements AfterViewInit, OnDestroy, OnChanges
{
    /** State of the given step. */
    public stepState: StepState;

    /** Custom icon config received from the wizard step. Allows to customize state icons for a particular wizard step */
    readonly stepStateConfig = input<Partial<WizardStepStateConfig>>();

    /** Label of the given step. */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() label: WizardStepLabelDirective | string;

    /** Label that is rendered below optional steps. */
    readonly optionalLabel = input<string>($localize `Optional`);

    /** Error message to display when there's an error. */
    readonly errorMessage = input<string>(undefined!);

    /** Index of the given step. */
    readonly index = input<number>(undefined!);

    /** Whether the given step is selected. */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() selected: boolean;

    /** Whether the given step label is active. */
    readonly active = input<boolean>(undefined!);

    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() step: WizardStepV2Component;

    public stepStateConfigMap: WizardStepStateConfig;

    private wizardConfig: IWizardConfig = { ...WIZARD_CONFIG_DEFAULT };

    constructor(
        private _focusMonitor: FocusMonitor,
        _elementRef: ElementRef<HTMLElement>,
        @Optional()
        @Inject(WIZARD_CONFIG)
        public readonly config?: IWizardConfig
    ) {
        super(_elementRef);

        if (this.config) {
            this.updateStepStateConfig(this.config.stepState);
        }

        this.createStepStateConfigMap();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.stepStateConfig?.currentValue) {
            this.updateStepStateConfig(changes?.stepStateConfig?.currentValue);
            this.createStepStateConfigMap();
        }

        this.stepState = this.getStepState(this.step);
    }

    public ngAfterViewInit(): void {
        this._focusMonitor.monitor(this._elementRef, true);
    }

    public ngOnDestroy(): void {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Focuses the step header. */
    public focus(): void {
        this._focusMonitor.focusVia(this._elementRef, "program");
    }

    /** Returns string label of given step if it is a text label. */
    public get stringLabel(): string | null {
        return this.label instanceof WizardStepLabelDirective
            ? null
            : this.label;
    }

    /** Returns WizardStepLabel if the label of given step is a template label. */
    public get templateLabel(): WizardStepLabelDirective | null {
        return this.label instanceof WizardStepLabelDirective
            ? this.label
            : null;
    }

    private updateStepStateConfig(stepStateConfig: WizardStepStateConfig) {
        this.wizardConfig.stepState = assign(
            { ...this.wizardConfig.stepState },
            stepStateConfig
        );
    }

    private createStepStateConfigMap() {
        this.stepStateConfigMap = {
            [STEP_STATE.NUMBER]: this.wizardConfig.stepState?.initial,
            [STEP_STATE.DONE]: this.wizardConfig.stepState?.visited,
            [STEP_STATE.EDIT]: this.wizardConfig.stepState?.active,
            [STEP_STATE.ERROR]: this.wizardConfig.stepState?.error,
        };
    }

    private getStepState(step: WizardStepV2Component): StepState {
        const isSelected = this.selected;

        if (step.hasError && isSelected) {
            return STEP_STATE.ERROR;
        }

        if (isSelected) {
            return STEP_STATE.EDIT;
        }

        if (step.completed) {
            return STEP_STATE.DONE;
        }

        return STEP_STATE.NUMBER;
    }
}
