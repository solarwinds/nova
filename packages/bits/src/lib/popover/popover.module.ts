import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiOverlayAdditionsModule } from "../overlay/overlay-additions.module";
import { NuiOverlayModule } from "../overlay/overlay.module";

import { PopoverModalComponent } from "./popover-modal.component";
import { PopoverComponent } from "./popover.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiIconModule,
        NuiOverlayModule,
        NuiOverlayAdditionsModule,
    ],
    declarations: [
        PopoverModalComponent,
        PopoverComponent,
    ],
    exports: [
        PopoverComponent,
        PopoverModalComponent,
    ],
    providers: [],
})
export class NuiPopoverModule {
}
