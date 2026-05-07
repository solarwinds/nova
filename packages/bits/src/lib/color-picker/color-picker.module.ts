import { NgModule } from "@angular/core";

import { NuiIconModule } from "../icon/icon.module";
import { NuiSelectV2Module } from "../select-v2/select-v2.module";
import { NuiCommonModule } from "../../common/common.module";
import { ColorPickerComponent } from "./color-picker.component";

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
