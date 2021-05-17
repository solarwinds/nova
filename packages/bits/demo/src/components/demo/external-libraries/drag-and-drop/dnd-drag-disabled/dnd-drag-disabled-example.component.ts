import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Component} from "@angular/core";

class IListItem  {
    title: string;
    enabled: boolean;
}

@Component({
    selector: "dnd-drag-disabled",
    templateUrl: "./dnd-drag-disabled-example.component.html",
    styleUrls: ["./dnd-drag-disabled-example.component.less"],
})
export class DndDragDisabledExampleComponent {
    public listItems: IListItem[] = [
        {
            title: "Adobe",
            enabled: true,
        },
        {
            title: "IBM",
            enabled: false,
        },
    ];

    public onItemDropped(event: CdkDragDrop<IListItem[]>) {
        moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
    }

    public translatedStatus(enabled: boolean) {
        return enabled ? $localize `Enabled` : $localize `Disabled`;
    }
}
