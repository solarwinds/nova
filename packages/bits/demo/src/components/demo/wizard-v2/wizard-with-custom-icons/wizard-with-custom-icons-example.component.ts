import { Component } from "@angular/core";
import { IWizardConfig, WizardStepStateConfig, WIZARD_CONFIG } from "@nova-ui/bits";
@Component({
    selector: "nui-wizard-with-custom-icons-example",
    templateUrl: "./wizard-with-custom-icons-example.component.html",
    providers: [
        {
            provide: WIZARD_CONFIG,
            useValue: {
                stepState: {
                    active: {
                        icon: "email",
                        color: "orange",
                    },
                },
            } as IWizardConfig,
        },
    ],
})
export class WizardWithCustomIconsExampleComponent {

    public secondStepIconConfig: Partial<WizardStepStateConfig> = {
        initial: {
            icon: "execute",
            color: "primary-blue",
        },
        visited: {
            icon: "star-full",
            color: "light-blue",
        },
        active: {
            icon: "star-full",
            color: "orange",
        },
    };
}
