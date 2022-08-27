import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { NuiSelectV2Module } from "../select-v2/select-v2.module";
import { PopupComponent } from "./popup-adapter.component";

@NgModule({
    declarations: [PopupComponent],
    imports: [
        CommonModule,
        PortalModule,
        NuiSelectV2Module,
        NuiCommonModule,
        NuiOverlayModule,
    ],
    exports: [PopupComponent],
})
export class PopupAdapterModule {}
