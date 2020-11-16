import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";

import {CardGroupComponent} from "./card-group/card-group.component";
import {CardComponent} from "./card/card.component";
import {LayoutResizerComponent} from "./layout-resizer/layout-resizer.component";
import {SheetGroupComponent} from "./sheet-group/sheet-group.component";
import {SheetComponent} from "./sheet/sheet.component";

// Don't ignore this module (component children need to be kept separate in the docs)
@NgModule({
    declarations: [ SheetComponent, SheetGroupComponent, CardComponent, CardGroupComponent, LayoutResizerComponent ],
    imports: [
        NuiCommonModule,
    ],
    exports: [
        SheetComponent,
        SheetGroupComponent,
        CardComponent,
        CardGroupComponent,
        LayoutResizerComponent,
    ],
    entryComponents: [LayoutResizerComponent],
    providers: [],
})
export class NuiLayoutModule {}
