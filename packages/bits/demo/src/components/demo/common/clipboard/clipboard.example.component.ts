import { Component } from "@angular/core";

@Component({
    selector: "nui-clipboard-demo",
    templateUrl: "./clipboard.example.component.html",
})
export class ClipboardExampleComponent {
    public textToCopy: string;
    public copiedSuccessfully = false;
    public copiedWithError = false;
    private timeout: number;
    private timeoutTime = 3000;

    public onValueChange(changedValue: any): void {
        this.textToCopy = changedValue;
    }

    public onClipboardSuccess(): void {
        this.copiedSuccessfully = true;
        this.timeout = window.setTimeout(() => {
            this.copiedSuccessfully = false;
        }, this.timeoutTime);
    }

    public onClipboardError(): void {
        this.copiedSuccessfully = false;
        this.copiedWithError = true;
        this.timeout = window.setTimeout(() => {
            this.copiedWithError = false;
        }, this.timeoutTime);
    }
}
