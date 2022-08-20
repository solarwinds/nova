import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiSelectV2Module } from "../select-v2/select-v2.module";

import { PaginatorComponent } from "./paginator.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiPopupModule,
        NuiButtonModule,
        ScrollingModule,
        NuiSelectV2Module,
    ],
    declarations: [PaginatorComponent],
    exports: [PaginatorComponent],
    providers: [],
})
export class NuiPaginatorModule {}
