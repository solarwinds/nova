import { Component } from "@angular/core";
import { IWizardConfig, IWizardStepStateIconConfig, WIZARD_CONFIG } from "@nova-ui/bits";
@Component({
    selector: "nui-wizard-with-custom-icons-example",
    templateUrl: "./wizard-with-custom-icons-example.component.html",
    providers: [
        {
            provide: WIZARD_CONFIG,
            useValue: {
                stepStateIcons: {
                    icons: { active: "email" },
                    colors: { active: "orange" },
                },
            } as IWizardConfig,
        },
    ],
})
export class WizardWithCustomIconsExampleComponent {

    public secondStepIconConfig: Partial<IWizardStepStateIconConfig> = {
        icons: {
            initial: "execute",
            active: "star-full",
            visited: "star-full",
        },
        colors: {
            initial: "primary-blue",
            active: "orange",
            visited: "light-blue",
        },
    };
}
