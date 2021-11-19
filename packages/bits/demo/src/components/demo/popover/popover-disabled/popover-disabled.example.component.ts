import { Component } from "@angular/core";


@Component({
    selector: "nui-popover-disabled-example",
    templateUrl: "./popover-disabled.example.component.html",
})
export class PopoverDisabledExampleComponent {
    public disabled = false;
    public buttonName = $localize`Disable`;

    constructor() { }

    changeStatus(): void {
        this.disabled = !this.disabled;
        this.buttonName = this.disabled ? $localize`Enable` : $localize`Disable`;
    }
}
