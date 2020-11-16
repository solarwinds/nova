import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { OverlayComponent } from "./overlay-component/overlay.component";
import { OverlayPositionService } from "./overlay-position.service";

/**
 * @ignore
 */
@NgModule({
    declarations: [
        OverlayComponent,
    ],
    exports: [
        OverlayComponent,
    ],
    imports: [
        OverlayModule,
        PortalModule,
        CommonModule,
    ],
    providers: [ OverlayPositionService ],
    entryComponents: [
        OverlayComponent,
    ],
})
export class NuiOverlayModule {}
