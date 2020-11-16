import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiSpinnerModule } from "../spinner/spinner.module";

import { BusyComponent } from "./busy.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiSpinnerModule,
    ],
    declarations: [
        BusyComponent,
    ],
    exports: [
        BusyComponent,
    ],
    providers: [],
})
export class NuiBusyModule {
}
