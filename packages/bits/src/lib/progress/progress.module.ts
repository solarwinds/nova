import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiTooltipModule } from "../tooltip/tooltip.module";

import { ProgressComponent } from "./progress.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiButtonModule,
        NuiTooltipModule,
    ],
    declarations: [
        ProgressComponent,
    ],
    exports: [
        ProgressComponent,
    ],
    providers: [],
})
export class NuiProgressModule {
}
