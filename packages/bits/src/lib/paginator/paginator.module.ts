import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiSelectModule } from "../select/select.module";

import { PaginatorComponent } from "./paginator.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiSelectModule,
        NuiPopupModule,
        NuiButtonModule,
        ScrollingModule,
    ],
    declarations: [
        PaginatorComponent,
    ],
    exports: [
        PaginatorComponent,
    ],
    providers: [],
})
export class NuiPaginatorModule {
}
