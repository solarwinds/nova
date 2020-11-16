import { Component } from "@angular/core";

@Component({
    selector: "nui-message-warning-example",
    templateUrl: "./message-warning.example.component.html",
})
export class MessageWarningExampleComponent {
    public onMessageDismiss(): void {
        console.log("Message was dismissed");
    }
}
