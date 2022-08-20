import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiOverlayModule } from "../overlay/overlay.module";

import { SorterComponent } from "./sorter.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiMenuModule,
        NuiButtonModule,
        NuiOverlayModule,
    ],
    declarations: [SorterComponent],
    exports: [SorterComponent],
    providers: [],
})
export class NuiSorterModule {}
