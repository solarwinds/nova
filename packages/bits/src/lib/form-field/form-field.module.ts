import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiPopoverModule } from "../popover/popover.module";

import { FormFieldComponent } from "./form-field.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiIconModule,
        NuiPopoverModule,
    ],
    declarations: [
        FormFieldComponent,
    ],
    exports: [
        FormFieldComponent,
    ],
    providers: [],
})
export class NuiFormFieldModule {
}
