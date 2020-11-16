import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../../common/common.module";
import { NuiButtonModule } from "../../button/button.module";
import { NuiDatePickerModule } from "../../date-picker/date-picker.module";
import { NuiDialogModule } from "../../dialog/dialog.module";
import { NuiIconModule } from "../../icon/icon.module";
import { NuiPopoverModule } from "../../popover/popover.module";
import { NuiTimeFramePickerModule } from "../../time-frame-picker/time-frame-picker.module";
import { NuiTimePickerModule } from "../../time-picker/time-picker.module";
import { NuiTooltipModule } from "../../tooltip/tooltip.module";

import { TimeFrameBarComponent } from "./time-frame-bar.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiButtonModule,
        NuiCommonModule,
        NuiDatePickerModule,
        NuiDialogModule,
        NuiIconModule,
        NuiPopoverModule,
        NuiTimeFramePickerModule,
        NuiTimePickerModule,
        NuiTooltipModule,
    ],
    declarations: [
        TimeFrameBarComponent,
    ],
    exports: [
        TimeFrameBarComponent,
    ],
    providers: [],
})
export class NuiTimeFrameBarModule {
}
