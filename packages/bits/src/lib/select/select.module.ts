import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { NuiCommonModule } from "../../common/common.module";
import { HighlightPipe } from "../../pipes/highlight.pipe";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiTextboxModule } from "../textbox/textbox.module";

import { ComboboxComponent } from "./combobox/combobox.component";
import { SelectComponent } from "./select.component";

/**
 * @ignore
 * @deprecated
 */
@NgModule({
    declarations: [
        ComboboxComponent,
        SelectComponent,
        HighlightPipe,
    ],
    imports: [
        NuiCommonModule,
        ReactiveFormsModule,
        NuiPopupModule,
        NuiIconModule,
        NuiTextboxModule,
        NuiButtonModule,
        NuiMenuModule,
    ],
    exports: [
        ComboboxComponent,
        SelectComponent,
        HighlightPipe,
        ReactiveFormsModule,
    ],
    providers: [],
})
export class NuiSelectModule { }
