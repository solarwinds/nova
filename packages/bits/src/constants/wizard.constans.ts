import {InjectionToken} from "@angular/core";
import {IWizardIcons} from "../lib/wizard-v2/wizard.directive";

export const wizardIconsPresetToken = new InjectionToken<IWizardIcons>("WIZARD_ICONS_PRESET");

export const WIZARD_ICONS_PRESET: Partial<IWizardIcons> = {
    initial: "step",
    visited: "step-complete",
    selected: "step-active",
    error: "severity_error",
}
