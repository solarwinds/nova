import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { ImageComponent } from "./image.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [ImageComponent],
    imports: [NuiCommonModule],
    exports: [ImageComponent],
    providers: [],
})
export class NuiImageModule {}
