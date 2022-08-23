import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { DraggableComponent } from "./draggable.component";
import { DroppableComponent } from "./droppable.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, DragDropModule],
    declarations: [DraggableComponent, DroppableComponent],
    exports: [DragDropModule, DraggableComponent, DroppableComponent],
    providers: [],
})
export class NuiDragDropModule {}
