import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";

import { CheckboxGroupComponent } from "./checkbox-group.component";
import { CheckboxComponent } from "./checkbox.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [CheckboxComponent, CheckboxGroupComponent],
    imports: [NuiCommonModule],
    exports: [CheckboxComponent, CheckboxGroupComponent],
    providers: [],
})
export class NuiCheckboxModule {}
