import { Component, ViewChild } from "@angular/core";
import { IBusyConfig, WizardComponent } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-wizard-busy-example",
    templateUrl: "./wizard-busy.example.component.html",
})
export class WizardBusyExampleComponent  {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;

    public busyConfig: IBusyConfig = {
        busy: false,
        message: $localize `Step is busy`,
    };

    constructor() {}

    public toggleStepBusy() {
        this.busyConfig.busy = !this.busyConfig.busy;
        this.wizardComponent.navigationControl.next({ busyState: this.busyConfig, allowStepChange: !this.busyConfig.busy});
    }
}
