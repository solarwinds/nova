import { EventEmitter, TemplateRef } from "@angular/core";

import { IBusyConfig } from "../busy/public-api";

export interface IWizardSelectionEvent {
    /** Index of the step now selected. */
    selectedIndex: number;

    /** Index of the step previously selected. */
    previouslySelectedIndex?: number;

    /** The step instance now selected. */
    selectedStep: any;

    /** The step instance previously selected. */
    previouslySelectedStep?: any;
}

export interface IWizardWaitEvent {
    busyState: IBusyConfig;
    allowStepChange: boolean;
}

export interface IWizardStepComponent extends Record<string, any> {
    title: string;
    stepTemplate: TemplateRef<any>;
    stepControl?: boolean;
    shortTitle?: string;
    description?: string;
    nextText?: string;
    disabled?: boolean;
    hidden?: boolean;
    enter?: EventEmitter<IWizardSelectionEvent | void>;
    exit?: EventEmitter<IWizardSelectionEvent | void>;
    next?: EventEmitter<IWizardSelectionEvent | void>;
    valid?: EventEmitter<boolean>;
}
