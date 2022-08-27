import { Component } from "@angular/core";

@Component({
    selector: "message-test-component",
    templateUrl: "message-test.component.html",
})
export class MessageTestComponent {
    public onMessageDismiss(): void {
        console.log("Message was dismissed");
    }
}
