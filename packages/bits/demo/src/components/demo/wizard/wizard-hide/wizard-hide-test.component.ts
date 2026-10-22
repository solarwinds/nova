import { Component } from "@angular/core";

@Component({
    selector: "nui-wizard-hide-test",
    template: `
        <nui-wizard-hide-example #hiddenWizardExample></nui-wizard-hide-example>
        <div class="btn-group">
            <button
                nui-button
                type="button"
                (click)="
                    hiddenWizardExample.wizardComponent.currentStep &&
                    hiddenWizardExample.wizardComponent.hideStep(
                        hiddenWizardExample.wizardComponent.currentStep
                    )
                ">
                Hide active step
            </button>
            <button
                nui-button
                type="button"
                (click)="
                    hiddenWizardExample.wizardComponent.currentStep &&
                    hiddenWizardExample.wizardComponent.showStep(
                        hiddenWizardExample.wizardComponent.currentStep
                    )
                ">
                Show active step
            </button>
        </div>
    `,
    standalone: false,
})
export class WizardHiddenTestComponent {}
