import { InjectionToken } from "@angular/core";
import { IWizardConfig, IWizardIconStates } from "../lib/public-api";

export const WIZARD_CONFIG = new InjectionToken<IWizardConfig>("wizard.conf");

export const WIZARD_STEP_DEFAULT_ICONS: IWizardIconStates = {
    initial: "step",
    visited: "step-complete",
    active: "step-active",
    error: "severity_error",
}

export const WIZARD_STEP_DEFAULT_ICON_COLORS: IWizardIconStates = {
    initial: "gray",
    visited: "primary-blue",
    active: "black",
    error: "red",
}

export const WIZARD_CONFIG_DEFAULT: IWizardConfig = {
    stepStateIcons: {
        icons: {...WIZARD_STEP_DEFAULT_ICONS},
        colors: {...WIZARD_STEP_DEFAULT_ICON_COLORS},
    },
}
