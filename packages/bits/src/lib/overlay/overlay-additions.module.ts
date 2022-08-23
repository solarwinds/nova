import { NgModule } from "@angular/core";

import { OverlayArrowComponent } from "./arrow-component/overlay-arrow.component";
import { OverlayItemComponent } from "./overlay-item/overlay-item.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [OverlayItemComponent, OverlayArrowComponent],
    exports: [OverlayItemComponent, OverlayArrowComponent],
    entryComponents: [OverlayItemComponent, OverlayArrowComponent],
})
export class NuiOverlayAdditionsModule {}
