import { Component } from "@angular/core";

@Component({
    selector: "nui-tooltip-disabled-example",
    templateUrl: "tooltip-disabled.example.component.html",
})
export class TooltipDisabledExampleComponent {
    public isDisabled = false;
    public tooltip = $localize`I am a Tooltip!`;
    public message = $localize`Toggle to switch state`;

    constructor() {}

    public onValueChanged(value: boolean) {
        this.isDisabled = value;
        this.message = value
            ? $localize`Tooltip is Disabled and hidden!`
            : $localize`Tooltip is Enabled and can be shown"`;
    }
}
