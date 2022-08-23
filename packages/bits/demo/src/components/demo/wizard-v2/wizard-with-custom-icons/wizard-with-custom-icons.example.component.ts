import { Component, ViewChild } from "@angular/core";

import {
    IWizardConfig,
    ToastService,
    WizardHorizontalComponent,
    WizardStepStateConfig,
    WIZARD_CONFIG,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-with-custom-icons-example",
    templateUrl: "./wizard-with-custom-icons.example.component.html",
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
    @ViewChild("wizard") wizard: WizardHorizontalComponent;

    constructor(private toastService: ToastService) {}

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
