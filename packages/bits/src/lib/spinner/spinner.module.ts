import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiTooltipModule } from "../tooltip/tooltip.module";

import { SpinnerComponent } from "./spinner.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [SpinnerComponent],
    imports: [NuiCommonModule, NuiButtonModule, NuiTooltipModule],
    exports: [SpinnerComponent],
    providers: [],
})
export class NuiSpinnerModule {}
