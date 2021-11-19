import { CdkDragDrop, CdkDropList, copyArrayItem } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "dnd-dropzone",
    templateUrl: "./dnd-dropzone.example.component.html",
    styleUrls: ["./dnd-dropzone.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndDropzoneExampleComponent {
    public sourceItems: string[] = ["Adobe", "IBM"];
    public destinationItems: string[] = ["Dell"];

    // prevent user from putting back already displaced items
    public sourceAcceptsItem(item: string, dropList?: CdkDropList): boolean {
        return false;
    }

    public destinationAcceptsItem(item: string, dropList?: CdkDropList): boolean {
        return item === "Adobe" || item === "Dell";
    }

    public onItemDropped(event: CdkDragDrop<string[]>): void {
        if (!this.destinationAcceptsItem(event.item.data)) {
            return;
        }

        copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
}
