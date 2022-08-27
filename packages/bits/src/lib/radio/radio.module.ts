import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { RadioComponent, RadioGroupComponent } from "./radio-group.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule],
    declarations: [RadioComponent, RadioGroupComponent],
    exports: [RadioComponent, RadioGroupComponent],
    providers: [],
})
export class NuiRadioModule {}
