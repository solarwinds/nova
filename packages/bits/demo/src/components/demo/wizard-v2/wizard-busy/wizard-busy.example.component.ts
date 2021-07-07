import { Component, ViewChild } from "@angular/core";
import { ToastService, WizardHorizontalComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-v2-busy-example",
    templateUrl: "./wizard-busy.example.component.html",
    styleUrls: ["./wizard-busy.example.component.less"],
})
export class WizardBusyExampleComponent {
    public busy: boolean;

    @ViewChild("wizard") private wizard: WizardHorizontalComponent;

    constructor(private toastService: ToastService) {
    }

    public resetWizard(): void {
        this.wizard.reset();
    }

    public toggleStepBusy(): void {
        this.busy = !this.busy;
        setTimeout(() => {
            this.busy = false;
        }, 3000);
    }

    public finishWizard(): void {
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Wizard has completed successfully`,
            options: {
                timeOut: 2000,
            },
        });
    }
}
