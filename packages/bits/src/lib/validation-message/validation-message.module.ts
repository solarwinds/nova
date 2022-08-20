import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";

import { CustomValidationMessageComponent } from "./custom-validation-message/custom-validation-message.component";
import { ValidationMessageComponent } from "./validation-message.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiIconModule],
    declarations: [
        ValidationMessageComponent,
        CustomValidationMessageComponent,
    ],
    exports: [ValidationMessageComponent, CustomValidationMessageComponent],
    providers: [],
})
export class NuiValidationMessageModule {}
