import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Component} from "@angular/core";
import {IRepeatItem} from "@solarwinds/nova-bits";

@Component({
  selector: "dnd-drag-placeholder",
  templateUrl: "./dnd-drag-placeholder-example.component.html",
  styleUrls: ["./dnd-drag-placeholder-example.component.less"],
})
export class DndDragPlaceholderExampleComponent {
    public listItems: string[] = ["Adobe", "IBM", "Dell" ];

    public onItemDropped(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
    }
}
