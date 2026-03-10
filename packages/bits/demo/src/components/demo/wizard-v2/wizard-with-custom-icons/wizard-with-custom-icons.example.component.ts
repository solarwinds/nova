// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component, ViewChild, inject } from "@angular/core";

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
    standalone: false,
})
export class WizardWithCustomIconsExampleComponent {
    private toastService = inject(ToastService);

    @ViewChild("wizard") wizard: WizardHorizontalComponent;

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
