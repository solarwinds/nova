import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";

import { ExpanderComponent } from "./expander.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiIconModule],
    declarations: [ExpanderComponent],
    exports: [ExpanderComponent],
    providers: [],
})
export class NuiExpanderModule {}
