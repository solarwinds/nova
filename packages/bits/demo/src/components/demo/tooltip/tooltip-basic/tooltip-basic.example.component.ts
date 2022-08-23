import { Component } from "@angular/core";

@Component({
    selector: "nui-tooltip-basic-example",
    templateUrl: "tooltip-basic.example.component.html",
})
export class TooltipBasicExampleComponent {
    public tooltip = $localize`I am a Tooltip!`;

    constructor() {}
}
