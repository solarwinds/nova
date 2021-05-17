import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import { Component} from "@angular/core";

class IListItem {
    title: string;
    enabled?: boolean;
    hasHandle?: boolean;
}

@Component({
    selector: "dnd-custom-handle",
    templateUrl: "./dnd-custom-handle.example.component.html",
    styleUrls: ["./dnd-custom-handle.example.component.less"],
})
export class DndCustomHandleExampleComponent {
    public mousedOver: boolean[] = [];
    public listItems: IListItem[] = [
        {
            title: "I can only be dragged using the handle",
            enabled: true,
            hasHandle: true,
        },
        {
            title: " I can be dragged without any handle",
            enabled: true,
            hasHandle: false,
        },
        {
            title: "Disabled item CAN'T be dragged",
            enabled: false,
        },
    ];

    public onItemDropped(event: CdkDragDrop<IListItem[]>) {
        moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
    }
}
