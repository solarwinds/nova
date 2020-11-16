import { Component } from "@angular/core";

@Component({
    selector: "nui-message-ok-example",
    templateUrl: "./message-ok.example.component.html",
})
export class MessageOkExampleComponent {
    public onMessageDismiss(): void {
        console.log("Message was dismissed");
    }
}
