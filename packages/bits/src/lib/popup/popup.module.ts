import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { PopupAdapterModule } from "../popup-adapter/popup-adapter.module";
import { PopupContainerComponent } from "./popup-container.component";
import { PopupToggleDirective } from "./popup-toggle.directive";
import { PopupDeprecatedComponent } from "./popup.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [
        PopupToggleDirective,
        PopupDeprecatedComponent,
        PopupContainerComponent,
    ],
    imports: [NuiCommonModule, PopupAdapterModule],
    exports: [PopupToggleDirective, PopupDeprecatedComponent, PopupComponent],
    entryComponents: [PopupContainerComponent],
})
export class NuiPopupModule {}
