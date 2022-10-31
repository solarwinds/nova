// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiPopoverModule } from "../popover/popover.module";
import { NuiTooltipModule } from "../tooltip/public-api";
import { ErrorStateMatcher } from "./error-state-matcher.provider";
import {
    WizardStepperNextDirective,
    WizardStepperPreviousDirective,
} from "./wizard-button/wizard-button";
import { WizardFooterComponent } from "./wizard-footer/wizard-footer.component";
import { WizardHorizontalComponent } from "./wizard-horizontal/wizard-horizontal.component";
import { WizardOverflowComponent } from "./wizard-overflow/wizard-overflow.component";
import { WizardStepFooterDirective } from "./wizard-step-footer.directive";
import { WizardStepHeaderComponent } from "./wizard-step-header/wizard-step-header.component";
import { WizardStepLabelDirective } from "./wizard-step-label.directive";
import { WizardStepV2Component } from "./wizard-step/wizard-step.component";
import { WizardVerticalComponent } from "./wizard-vertical/wizard-vertical.component";
import { WizardDirective } from "./wizard.directive";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiIconModule,
        NuiPopoverModule,
        NuiTooltipModule,
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
        WizardOverflowComponent,
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
