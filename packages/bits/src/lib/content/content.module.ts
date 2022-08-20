import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";

import { ContentComponent } from "./content.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule],
    declarations: [ContentComponent],
    exports: [ContentComponent],
    providers: [],
})
export class NuiContentModule {}
