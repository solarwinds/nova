import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Component} from "@angular/core";
import {IRepeatItem} from "@nova-ui/bits";

interface IListItem extends IRepeatItem {
    title: string;
    preview: string;
}

@Component({
  selector: "dnd-drag-preview",
  templateUrl: "./dnd-drag-preview.example.component.html",
  styleUrls: ["./dnd-drag-preview.example.component.less"],
})
export class DndDragPreviewExampleComponent {
    public listItems: IListItem[] = [
        {
            title: "Adobe",
            preview: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/524px-Adobe_Systems_logo_and_wordmark.svg.png",
        },
        {
            title: "IBM",
            preview: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/800px-IBM_logo.svg.png",
        },
        {
            title: "Dell",
            preview: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/300px-Dell_Logo.svg.png",
        },
    ];

    public onItemDropped(event: CdkDragDrop<IListItem[]>) {
        moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
    }
}
