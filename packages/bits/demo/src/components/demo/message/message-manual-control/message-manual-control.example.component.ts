import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "nui-message-manual-control-example",
    templateUrl: "./message-manual-control.example.component.html",
})
export class MessageManualControlExampleComponent {
    public isVisible: boolean = true;
    public messageVisibilitySubject = new Subject<boolean>();

    public onMessageDismiss(): void {
        this.isVisible = !this.isVisible;
    }

    public toggleMessage() {
        this.isVisible = !this.isVisible;
        this.messageVisibilitySubject.next(this.isVisible);
    }
}
