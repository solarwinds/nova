import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiTextboxModule } from "../textbox/textbox.module";

import { ComboboxComponent } from "./combobox/combobox.component";
import { SelectComponent } from "./select.component";

// eslint-disable-next-line max-len
/** @ignore @deprecated in v11 SelectComponent and ComboboxComponent in this module have been deprecated in favor of SelectV2Component and ComboboxV2Component which can be imported from SelectV2Module */
@NgModule({
    declarations: [ComboboxComponent, SelectComponent],
    imports: [
        NuiCommonModule,
        ReactiveFormsModule,
        NuiPopupModule,
        NuiIconModule,
        NuiTextboxModule,
        NuiButtonModule,
        NuiMenuModule,
    ],
    exports: [ComboboxComponent, SelectComponent, ReactiveFormsModule],
    providers: [],
})
export class NuiSelectModule {}
