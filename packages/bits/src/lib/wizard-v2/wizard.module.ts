import { NgModule } from "@angular/core";

import {NuiCommonModule} from "../../common/common.module";
import {NuiIconModule} from "../icon/icon.module";

import {ErrorStateMatcher} from "./error-state-matcher.provider";
import {WizardStepperNextDirective, WizardStepperPreviousDirective} from "./wizard-button";
import {WizardFooterComponent} from "./wizard-footer.component";
import {WizardHorizontalComponent} from "./wizard-horizontal.component";
import {WizardStepFooterDirective} from "./wizard-step-footer.directive";
import {WizardStepHeaderComponent} from "./wizard-step-header.component";
import {WizardStepLabelDirective} from "./wizard-step-label.directive";
import {WizardDirective, WizardStepV2Component} from "./wizard-step.component";
import {WizardVerticalComponent} from "./wizard-vertical.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiIconModule,
    ],
    declarations: [
        WizardHorizontalComponent,
        WizardVerticalComponent,
        WizardStepHeaderComponent,
        WizardFooterComponent,
        WizardStepV2Component,
        WizardDirective,
        WizardStepLabelDirective,
        WizardStepFooterDirective,
        WizardStepperNextDirective,
        WizardStepperPreviousDirective,
    ],
    exports: [
        WizardHorizontalComponent,
        WizardVerticalComponent,

        WizardFooterComponent,

        WizardStepV2Component,
        WizardDirective,
        WizardStepLabelDirective,

        // next & previous directive to be applied on buttons in order to navigate
        // through the wizard steps
        WizardStepperNextDirective,
        WizardStepperPreviousDirective,

        WizardStepHeaderComponent,
        WizardStepFooterDirective,
    ],
    providers: [ErrorStateMatcher],
})
export class NuiWizardV2Module {}
