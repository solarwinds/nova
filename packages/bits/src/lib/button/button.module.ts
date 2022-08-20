import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";

import { ButtonComponent } from "./button.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [ButtonComponent],
    imports: [NuiCommonModule, NuiIconModule],
    exports: [ButtonComponent],
    providers: [],
})
export class NuiButtonModule {}
