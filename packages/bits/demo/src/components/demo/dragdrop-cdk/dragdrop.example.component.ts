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
    public draggableList = [
        "item 1", "item2", "item3",
    ];
    public destObject: {};

    public onDrop(payload: any): void {
        this.destObject = payload;
    }

    public onDragStart(event: DragEvent): void {
    }

    public onDragEnd(event: DragEvent): void {
    }

    public onDragOver(event: DragEvent): void {
    }

    public onDragEnter(event: DragEvent): void {
    }

    public onDragLeave(event: DragEvent): void {
    }
}
