import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiDateTimerPickerModule } from "../date-time-picker/date-time-picker.module";
import { NuiMenuModule } from "../menu/menu.module";

import { QuickPickerComponent } from "./quick-picker/quick-picker.component";
import { TimeframeService } from "./services/timeframe.service";
import { TimeFrameFormatPipe } from "./time-frame-format.pipe";
import { TimeFramePickerComponent } from "./time-frame-picker.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiMenuModule,
        NuiDateTimerPickerModule,
    ],
    declarations: [
        QuickPickerComponent,
        TimeFramePickerComponent,
        TimeFrameFormatPipe,
    ],
    exports: [
        QuickPickerComponent,
        TimeFramePickerComponent,
        TimeFrameFormatPipe,
    ],
    providers: [TimeframeService],
})
export class NuiTimeFramePickerModule {
}
