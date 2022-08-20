import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiRepeatModule } from "../repeat/repeat.module";
import { NuiSpinnerModule } from "../spinner/spinner.module";

import { TextboxNumberComponent } from "./textbox-number/textbox-number.component";
import { TextboxComponent } from "./textbox.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiSpinnerModule,
        NuiButtonModule,
        FormsModule,
        NuiButtonModule,
        NuiRepeatModule,
    ],
    declarations: [TextboxComponent, TextboxNumberComponent],
    exports: [TextboxComponent, TextboxNumberComponent],
    providers: [],
})
export class NuiTextboxModule {}
