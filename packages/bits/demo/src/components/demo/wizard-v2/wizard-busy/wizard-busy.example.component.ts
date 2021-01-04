import { Component } from "@angular/core";

@Component({
    selector: "nui-wizard-v2-busy-example",
    templateUrl: "./wizard-busy.example.component.html",
    styleUrls: ["./wizard-busy.example.component.less"],
})
export class WizardBusyExampleComponent  {
    public busy: boolean;

    public toggleStepBusy() {
        this.busy = !this.busy;
        setTimeout(() => {
            this.busy = false;
        }, 3000);
    }
}
