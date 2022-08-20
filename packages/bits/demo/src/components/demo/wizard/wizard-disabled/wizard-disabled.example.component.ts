import { Component, ViewChild } from "@angular/core";
import { WizardComponent, WizardStepComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-disabled-example",
    templateUrl: "./wizard-disabled.example.component.html",
})
export class WizardDisabledExampleComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("wizardStepDisable")
    wizardStepDisabledComponent: WizardStepComponent;

    public disableStep() {
        this.wizardComponent.disableStep(this.wizardStepDisabledComponent);
    }

    public enableStep() {
        this.wizardComponent.enableStep(this.wizardStepDisabledComponent);
    }
}
