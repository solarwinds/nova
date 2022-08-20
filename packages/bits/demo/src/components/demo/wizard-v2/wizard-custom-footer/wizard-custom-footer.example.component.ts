import { Component, ViewChild } from "@angular/core";
import { ToastService, WizardHorizontalComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-custom-footer-example",
    templateUrl: "./wizard-custom-footer.example.component.html",
    styleUrls: ["./wizard-custom-footer.example.component.less"],
})
export class WizardCustomFooterExampleComponent {
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
