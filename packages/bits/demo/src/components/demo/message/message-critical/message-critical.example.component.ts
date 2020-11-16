import { Component } from "@angular/core";

@Component({
    selector: "nui-message-critical-example",
    templateUrl: "./message-critical.example.component.html",
})
export class MessageCriticalExampleComponent {
    public onMessageDismiss(): void {
        console.log("Message was dismissed");
    }
}
