import {Component} from "@angular/core";
import {IconStatus} from "@nova-ui/bits";

@Component({
    selector: "nui-icon-with-text-example",
    templateUrl: "./icon-with-text.example.component.html",
})

export class IconWithTextExampleComponent {
    status: IconStatus = IconStatus.Up;
    childStatus: IconStatus = IconStatus.Sleep;
}
