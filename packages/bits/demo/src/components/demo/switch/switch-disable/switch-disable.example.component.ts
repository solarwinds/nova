import { Component, Input } from "@angular/core";

@Component({
    selector: "nui-switch-disable-example",
    templateUrl: "./switch-disable.example.component.html",
})

export class SwitchDisableExampleComponent {
    @Input() isOn = true;
    isDisabled = true;
}
