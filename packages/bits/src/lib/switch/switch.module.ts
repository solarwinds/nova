import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";

import { SwitchComponent } from "./switch.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [SwitchComponent],
    imports: [
        NuiCommonModule,
    ],
    exports: [SwitchComponent],
    providers: [],
})
export class NuiSwitchModule { }
