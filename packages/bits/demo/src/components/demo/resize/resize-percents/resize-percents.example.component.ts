import { Component } from "@angular/core";

import { ResizeUnit } from "@nova-ui/bits";

@Component({
    selector: "nui-resize-percents-example",
    templateUrl: "./resize-percents.example.component.html",
})
export class ResizePercentsExampleComponent {
    public measurement = ResizeUnit.percent;
}
