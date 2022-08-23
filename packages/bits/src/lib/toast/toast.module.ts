import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { ToastContainerService } from "./toast-container.service";
import { ToastComponent } from "./toast.component";
import { ToastDirective } from "./toast.directive";
import { ToastService } from "./toast.service";
import { ToastServiceBase } from "./toast.servicebase";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiIconModule, NuiButtonModule],
    declarations: [ToastComponent, ToastDirective],
    exports: [ToastComponent, ToastDirective],
    entryComponents: [ToastComponent],
    providers: [
        ToastService,
        ToastContainerService,
        { provide: ToastServiceBase, useExisting: ToastService },
    ],
})
export class NuiToastModule {}
