import { NgModule } from "@angular/core";

import { ColorPickerComponent } from "./color-picker.component";
import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiSelectV2Module } from "../select-v2/select-v2.module";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiSelectV2Module, NuiIconModule],
    declarations: [ColorPickerComponent],
    exports: [ColorPickerComponent],
    providers: [],
})
export class NuiColorPickerModule {}
