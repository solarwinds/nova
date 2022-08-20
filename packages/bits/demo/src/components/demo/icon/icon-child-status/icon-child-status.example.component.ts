import { Component } from "@angular/core";
import { IconStatus } from "@nova-ui/bits";

@Component({
    selector: "nui-icon-child-status-example",
    templateUrl: "./icon-child-status.example.component.html",
})
export class IconChildStatusExampleComponent {
    status: IconStatus = IconStatus.Up;
    childStatus: IconStatus = IconStatus.Sleep;
}
