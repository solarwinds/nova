import { NgModule } from "@angular/core";

import {NuiCommonModule} from "../../common/common.module";
import {NuiIconModule} from "../icon/icon.module";

import {ErrorStateMatcher} from "./error-state-matcher.provider";
import {WizardStepperNextDirective, WizardStepperPreviousDirective} from "./wizard-button/wizard-button";
import {WizardFooterComponent} from "./wizard-footer/wizard-footer.component";
import {WizardHorizontalComponent} from "./wizard-horizontal/wizard-horizontal.component";
import {WizardStepFooterDirective} from "./wizard-step-footer.directive";
import {WizardStepHeaderComponent} from "./wizard-step-header/wizard-step-header.component";
import {WizardStepLabelDirective} from "./wizard-step-label.directive";
import {WizardStepV2Component} from "./wizard-step/wizard-step.component";
import {WizardVerticalComponent} from "./wizard-vertical/wizard-vertical.component";
import { WizardDirective } from "./wizard.directive";
import {WizardIconDirective} from "./wizard-icon.directive";

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
        WizardIconDirective,
    ],
    exports: [
        WizardHorizontalComponent,
        WizardVerticalComponent,

        WizardFooterComponent,

        WizardStepV2Component,
        WizardDirective,
        WizardStepLabelDirective,
        WizardIconDirective,

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
