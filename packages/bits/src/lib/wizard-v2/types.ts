
export type WizardStepState = "active" | "visited" | "initial" | "error" | string;
export type WizardStepStateConfig = Record<WizardStepState, IWizardStepStateConfig>;

export interface IWizardState {
    finished: boolean;
}

export interface IWizardConfig {
    stepState: WizardStepStateConfig;
    [key: string]: any;
}

export interface IWizardStepStateConfig {
    icon?: string;
    iconColor?: string;
}
