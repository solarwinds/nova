import { Component, ViewChild } from "@angular/core";
import { IBusyConfig, WizardComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-busy-example",
    templateUrl: "./wizard-busy.example.component.html",
})
export class WizardBusyExampleComponent  {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;

    public isBusy = false;

    public busyConfig: IBusyConfig = {
        busy: false,
        message: $localize `Step is busy`,
    };

    constructor() {}

    public toggleStepBusy() {
        /* Switch off spinner of all content. Just to avoid two spinners */
        this.isBusy = false;
        this.busyConfig.busy = !this.busyConfig.busy;
        this.wizardComponent.navigationControl.next({ busyState: this.busyConfig, allowStepChange: !this.busyConfig.busy});
    }

    public toggleBusy(): void {
        /* Switch off spinner of step content. Just to avoid two spinners */
        this.busyConfig.busy = false;
        this.isBusy = !this.isBusy;
    }
}
