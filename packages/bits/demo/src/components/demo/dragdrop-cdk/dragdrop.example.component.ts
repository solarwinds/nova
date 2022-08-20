import { Component } from "@angular/core";

@Component({
    selector: "nui-dd-cdk-example",
    templateUrl: "./dragdrop.example.component.html",
    styleUrls: ["./dragdrop.example.component.less"],
})
export class DragdropExampleComponent {
    public draggableObj = {
        imma: "little",
        teapot: "short and stout",
    };
    public draggableObjHandle = {
        "here is my handle": "here is my spout",
    };
    public draggableObjPreview = {
        when: "I get all steamed up",
        hear: "me shout",
    };
    public draggableList = ["item 1", "item2", "item3"];
    public destObject: {};

    public onDrop(payload: any) {
        this.destObject = payload;
    }

    public onDragStart(event: DragEvent) {}

    public onDragEnd(event: DragEvent) {}

    public onDragOver(event: DragEvent) {}

    public onDragEnter(event: DragEvent) {}

    public onDragLeave(event: DragEvent) {}
}
