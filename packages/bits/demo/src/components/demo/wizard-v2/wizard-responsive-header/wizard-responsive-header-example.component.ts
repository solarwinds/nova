import { Component, ViewChild } from "@angular/core";
import { WizardHorizontalComponent } from "../../../../../../src/nui-api";
import { ToastService } from "../../../../../../src/public_api";
@Component({
    selector: "nui-wizard-responsive-header-example",
    templateUrl: "./wizard-responsive-header-example.component.html",
})
export class WizardResponsiveHeaderExampleComponent {
    public steps: Array<any> = Array.from({length: 20});

    @ViewChild("nuiWizard") public wizard: WizardHorizontalComponent;

    constructor(private toast: ToastService) {}

    public reset(): void {
        this.wizard.reset();
    }

    public notifyOnFinished(): void {
        this.toast.info({title: "Finished!", message: "You have completed the wizard"});
    }

    public notifyOnCancel(): void {
        this.toast.warning({title: "Cancelled!", message: "You've hit the wizard's 'Cancel' button! The wizard is now restored to its initial state."});
    }

}
