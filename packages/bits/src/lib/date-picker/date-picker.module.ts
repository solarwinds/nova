import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { NuiTextboxModule } from "../textbox/textbox.module";

import { DayPickerComponent } from "./date-picker-day-picker.component";
import { DatePickerInnerComponent } from "./date-picker-inner.component";
import { MonthPickerComponent } from "./date-picker-month-picker.component";
import { YearPickerComponent } from "./date-picker-year-picker.component";
import { DatePickerComponent } from "./date-picker.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiTextboxModule,
        NuiIconModule,
        NuiButtonModule,
        NuiOverlayModule,
    ],
    declarations: [
        YearPickerComponent,
        MonthPickerComponent,
        DatePickerInnerComponent,
        DayPickerComponent,
        DatePickerComponent,
    ],
    exports: [
        DatePickerComponent,
    ],
    providers: [],
})
export class NuiDatePickerModule {
}
