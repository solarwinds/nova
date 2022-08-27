import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { IconComponent } from "./icon.component";
import { IconService } from "./icon.service";

/**
 * @ignore
 */
@NgModule({
    declarations: [IconComponent],
    imports: [NuiCommonModule],
    exports: [IconComponent],
    providers: [IconService],
})
export class NuiIconModule {}
