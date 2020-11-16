import { Component } from "@angular/core";

@Component({
    selector: "nui-message-info-example",
    templateUrl: "./message-info.example.component.html",
})
export class MessageInfoExampleComponent {
    onMessageDismiss() {
        console.log("Message was dismissed");
    }
}
