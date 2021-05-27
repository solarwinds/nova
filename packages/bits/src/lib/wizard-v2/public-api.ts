import { QueryList } from "@angular/core";
import { WizardStepV2Component } from "./wizard-step/wizard-step.component";

export * from "./wizard.module";
export * from "./wizard.directive";
export * from "./wizard-step-footer.directive";
export * from "./wizard-step-label.directive";
export * from "./error-state-matcher.provider";
export * from "./wizard-animations/wizard-animations";
export * from "./wizard-button/wizard-button";
export * from "./wizard-footer/wizard-footer.component";
export * from "./wizard-horizontal/wizard-horizontal.component";
export * from "./wizard-step/wizard-step.component";
export * from "./wizard-step-header/wizard-step-header.component";
export * from "./wizard-vertical/wizard-vertical.component";

export interface IWizardState {
    steps: QueryList<WizardStepV2Component>;
}
