import {CdkDropList} from "@angular/cdk/drag-drop";
import {Component, EventEmitter, Output, ViewChild} from "@angular/core";

// import {DraggableComponent} from "./draggable.component";

/**
 * @ignore
 */
@Component({
    selector: "nui-droppable",
    templateUrl: "./droppable.component.html",
    styleUrls: ["./droppable.component.less"],
    host: { "[attr.aria-dropeffect]": "move" },
})
export class DroppableComponent {
    // @Input() dragSource: DraggableComponent;

  @Output() dragOver = new EventEmitter<DragEvent>();
  @Output() dragEnter = new EventEmitter<DragEvent>();
  @Output() dragLeave = new EventEmitter<DragEvent>();
  @Output() dropSuccess = new EventEmitter<any>();

  @ViewChild(CdkDropList, {static: true}) dropList: CdkDropList;

  onDrop(event: any) {
      if (event.container !== event.previousContainer) {
          this.dropSuccess.emit(event.item.data);
      }
  }
}
