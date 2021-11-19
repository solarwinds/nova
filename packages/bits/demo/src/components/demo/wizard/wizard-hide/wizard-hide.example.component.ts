import { Component, ViewChild } from "@angular/core";
import { WizardComponent, WizardStepComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-hide-example",
    templateUrl: "./wizard-hide.example.component.html",
})
export class WizardHiddenExampleComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("wizardStepHidden") wizardStepHiddenComponent: WizardStepComponent;

    public hideStep(): void {
        this.wizardComponent.hideStep(this.wizardStepHiddenComponent);
    }

    public showStep(): void {
        this.wizardComponent.showStep(this.wizardStepHiddenComponent);
    }
}
