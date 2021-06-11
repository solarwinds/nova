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
                        iconColor: "orange",
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
            iconColor: "primary-blue",
        },
        visited: {
            icon: "star-full",
            iconColor: "light-blue",
        },
        active: {
            icon: "star-full",
            iconColor: "orange",
        },
    };
}
