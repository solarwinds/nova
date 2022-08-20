import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";

import { DividerComponent } from "./divider.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [DividerComponent],
    imports: [NuiCommonModule],
    exports: [DividerComponent],
    providers: [],
})
export class NuiDividerModule {}
