import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { DndDropTargetDirective } from "./dnd-drop-target.directive";

/**
 * @ignore
 */
@NgModule({
    declarations: [DndDropTargetDirective],
    imports: [NuiCommonModule],
    exports: [DndDropTargetDirective],
})
export class NuiDndModule {}
