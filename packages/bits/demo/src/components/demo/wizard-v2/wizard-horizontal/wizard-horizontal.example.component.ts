import { Component, ViewChild } from "@angular/core";
import { ToastService, WizardHorizontalComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-horizontal-example",
    templateUrl: "./wizard-horizontal.example.component.html",
})
export class WizardHorizontalExampleComponent {
    @ViewChild("wizard") private wizard: WizardHorizontalComponent;

    constructor(private toastService: ToastService) {}

    public resetWizard(): void {
        this.wizard.reset();
    }

    public finishWizard(): void {
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Wizard was completed successfully`,
            options: {
                timeOut: 2000,
            },
        });
    }
}
