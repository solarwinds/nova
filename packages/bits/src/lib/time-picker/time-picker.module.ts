import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { NuiTextboxModule } from "../textbox/textbox.module";

import { TimePickerComponent } from "./time-picker.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiTextboxModule,
        NuiIconModule,
        NuiOverlayModule,
        NuiMenuModule,
    ],
    declarations: [TimePickerComponent],
    exports: [TimePickerComponent],
    providers: [],
})
export class NuiTimePickerModule {}
