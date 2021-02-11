import { A11yModule } from "@angular/cdk/a11y";
import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiOverlayModule } from "../overlay/overlay.module";

import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
import { DialogBackdropComponent } from "./dialog-backdrop.component";
import { DialogFooterComponent } from "./dialog-footer.component";
import { DialogHeaderComponent } from "./dialog-header.component";
import { DialogStackService } from "./dialog-stack.service";
import { DialogComponent } from "./dialog.component";
import { DialogService } from "./dialog.service";

/**
 * @ignore
 */
@NgModule({
    imports: [
        A11yModule,
        NuiCommonModule,
        NuiIconModule,
        NuiButtonModule,
        NuiOverlayModule,
    ],
    declarations: [
        ConfirmationDialogComponent,
        DialogComponent,
        DialogHeaderComponent,
        DialogFooterComponent,
        DialogBackdropComponent,
    ],
    exports: [
        DialogHeaderComponent,
        DialogFooterComponent,
    ],
    entryComponents: [
        DialogComponent,
        DialogBackdropComponent,
        ConfirmationDialogComponent,
    ],
    providers: [
        DialogService,
        DialogStackService,
    ],
})
export class NuiDialogModule {
}
