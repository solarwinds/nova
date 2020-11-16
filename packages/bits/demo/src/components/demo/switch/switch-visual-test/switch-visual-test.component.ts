import { Component, Input } from "@angular/core";

@Component({
    selector: "nui-switch-visual",
    templateUrl: "./switch-visual-test.component.html",
})
export class SwitchVisualTestComponent {
    @Input() isOn = true;
    @Input() isEnabled = false;
    public isDisabled = true;
}
