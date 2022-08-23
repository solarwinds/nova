import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiCheckboxModule } from "../checkbox/checkbox.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { SelectorComponent } from "./selector.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiCheckboxModule,
        NuiMenuModule,
        NuiButtonModule,
        NuiOverlayModule,
    ],
    declarations: [SelectorComponent],
    exports: [SelectorComponent],
    providers: [],
})
export class NuiSelectorModule {}
