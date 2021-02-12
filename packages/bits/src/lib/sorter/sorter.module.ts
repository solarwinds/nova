import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiPopupModule } from "../popup/popup.module";

import { SorterComponent } from "./sorter.component";
import {NuiOverlayModule} from "../overlay/overlay.module";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiMenuModule,
        NuiPopupModule,
        NuiButtonModule,
        NuiOverlayModule,
    ],
    declarations: [
        SorterComponent,
    ],
    exports: [
        SorterComponent,
    ],
    providers: [],
})
export class NuiSorterModule {
}
