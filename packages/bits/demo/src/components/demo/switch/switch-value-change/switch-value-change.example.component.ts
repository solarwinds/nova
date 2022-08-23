import { Component, Input } from "@angular/core";

@Component({
    selector: "nui-switch-value-change-example",
    templateUrl: "./switch-value-change.example.component.html",
})
export class SwitchValueChangeExampleComponent {
    @Input() isOn = true;
    private valueChangeCount = 0;
    public changeMessage = $localize`Value has not changed`;

    constructor() {}

    public onValueChanged(value: boolean): void {
        this.isOn = value;
        ++this.valueChangeCount;
        this.changeMessage = $localize`Value changed ${this.valueChangeCount} times.`;
    }
}
