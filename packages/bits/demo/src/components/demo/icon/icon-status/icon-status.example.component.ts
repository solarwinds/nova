import {Component} from "@angular/core";
import {IconStatus} from "@solarwinds/nova-bits";

@Component({
    selector: "nui-icon-status-example",
    templateUrl: "./icon-status.example.component.html",
})

export class IconStatusExampleComponent {
    status: IconStatus = IconStatus.Up;
}
