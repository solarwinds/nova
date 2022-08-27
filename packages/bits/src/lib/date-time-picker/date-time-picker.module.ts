import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiDatePickerModule } from "../date-picker/date-picker.module";
import { NuiTimePickerModule } from "../time-picker/time-picker.module";
import { DateTimePickerComponent } from "./date-time-picker.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiDatePickerModule, NuiTimePickerModule],
    declarations: [DateTimePickerComponent],
    exports: [DateTimePickerComponent],
    providers: [],
})
export class NuiDateTimePickerModule {}
