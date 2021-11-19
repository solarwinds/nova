import { Component } from "@angular/core";

@Component({
    selector: "nui-resize-basic-example",
    templateUrl: "./resize-basic.example.component.html",
})
export class ResizeBasicExampleComponent {
    public newSizeText: string = "Size is not changed.";
    public sizeChanged(size: string): void {
        this.newSizeText = `New size is ${size}`;
    }
}
