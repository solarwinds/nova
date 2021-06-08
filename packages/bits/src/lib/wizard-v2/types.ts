
export interface IWizardState {
    finished: boolean;
}

export interface IWizardConfig {
    stepStateIcons: IWizardStepStateIconConfig;
    [key: string]: any;
}

export interface IWizardStepStateIconConfig {
    icons?: Partial<IWizardIconStates>;
    colors?: Partial<IWizardIconStates>;
}

export interface IWizardIconStates {
    active: string;
    visited: string;
    initial: string;
    error: string;
    [key: string]: string;
}
