import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiBusyModule } from "../busy/busy.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiSpinnerModule } from "../spinner/spinner.module";

import { WizardStepComponent } from "./wizard-step.component";
import { WizardComponent } from "./wizard.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiButtonModule,
        NuiBusyModule,
        NuiIconModule,
        NuiSpinnerModule,
    ],
    declarations: [WizardComponent, WizardStepComponent],
    exports: [WizardComponent, WizardStepComponent],
    entryComponents: [WizardStepComponent],
    providers: [],
})
export class NuiWizardModule {}
