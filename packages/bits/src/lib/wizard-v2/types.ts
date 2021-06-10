
export type WizardIconStates = "active" | "visited" | "initial" | "error" | string;
export type WizardStepStateConfig = Record<WizardIconStates, IWizardStepStateConfig>;

export interface IWizardState {
    finished: boolean;
}

export interface IWizardConfig {
    stepState: WizardStepStateConfig;
    [key: string]: any;
}

export interface IWizardStepStateConfig {
    icon?: string;
    color?: string;
}
