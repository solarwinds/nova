import { EventEmitter, TemplateRef } from "@angular/core";
import { IBusyConfig } from "@nova-ui/bits";

export interface IDashwizStepNavigatedEvent {
    /** Index of the current step. */
    currentStepIndex: number;

    /** Index of the previous step. */
    previousStepIndex?: number;

    /** The current step instance. */
    currentStep: any;

    /** The previous step instance. */
    previousStep?: any;
}

export interface IDashwizWaitEvent {
    busyState: IBusyConfig;
    allowStepChange: boolean;
}

export interface IDashwizStepComponent {
    stepTemplate?: TemplateRef<any>;
    stepControl?: boolean;
    nextText?: string;
    disabled?: boolean;
    hidden?: boolean;
    enter?: EventEmitter<IDashwizStepNavigatedEvent | void>;
    exit?: EventEmitter<IDashwizStepNavigatedEvent | void>;
    next?: EventEmitter<IDashwizStepNavigatedEvent | void>;
    valid?: EventEmitter<boolean>;
}

export interface IDashwizButtonsComponent {
    // Inputs
    busy?: boolean;
    canProceed?: boolean;
    canFinish?: boolean;
    isFirstStepActive?: boolean;
    isLastStepActive?: boolean;
    nextText?: string;
    finishText?: string;

    // Outputs
    cancel?: EventEmitter<void>;
    next?: EventEmitter<void>;
    back?: EventEmitter<void>;
    finish?: EventEmitter<void>;
}
