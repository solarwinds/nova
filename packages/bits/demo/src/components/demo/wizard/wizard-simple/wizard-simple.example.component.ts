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

import { Component, Inject, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import {
    DialogService,
    IBusyConfig,
    IWizardSelectionEvent,
    NuiDialogRef,
    ToastService,
    WizardComponent,
    WizardStepComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-simple-example",
    templateUrl: "./wizard-simple.example.component.html",
})
export class WizardSimpleExampleComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("wizardStep2") wizardStep2Component: WizardStepComponent;
    @ViewChild("wizardStep3") wizardStep3Component: WizardStepComponent;
    @ViewChild("dynamicStep") dynamicStep: WizardStepComponent;
    public myForm;
    public hint = $localize`example-hint`;
    public caption = $localize`example-caption`;
    public vegetables = [
        $localize`Cabbage`,
        $localize`Potato`,
        $localize`Tomato`,
        $localize`Carrot`,
    ];
    public selectedVegetables = [$localize`Potato`, $localize`Tomato`];
    public secondStepBusyConfig: IBusyConfig = {
        busy: false,
        message: $localize`Step is busy`,
    };
    public busyConfig: IBusyConfig = {
        busy: false,
        message: $localize`Step is busy`,
    };
    public selectedIndex: number;

    private activeDialog: NuiDialogRef;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService,
        @Inject(DialogService) private dialogService: DialogService
    ) {
        this.myForm = this.formBuilder.group({
            name: ["", Validators.required],
            email: [
                "",
                [Validators.required, Validators.pattern("[^ @]*@[^ @]*")],
            ],
            password: ["", [Validators.required, Validators.minLength(8)]],
        });
    }

    public onOptionChange(value: string): void {
        this.hint = value;
    }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }

    public valuesChanged(values: any[]): void {
        this.selectedVegetables = [...values];
    }

    public addStep(): void {
        this.wizardComponent.addStepDynamic(
            this.dynamicStep,
            this.selectedIndex + 1
        );
    }

    public disableSecondStep(): void {
        this.wizardComponent.disableStep(this.wizardStep2Component);
    }

    public hideThirdStep(): void {
        this.wizardComponent.hideStep(this.wizardStep3Component);
    }

    public visibleThirdStep(): void {
        this.wizardComponent.showStep(this.wizardStep3Component);
    }

    public makeSecondStepBusy(): void {
        this.secondStepBusyConfig.busy = true;
        this.wizardComponent.navigationControl.next({
            busyState: this.secondStepBusyConfig,
            allowStepChange: false,
        });
        setTimeout(() => {
            this.secondStepBusyConfig.busy = false;
            this.wizardComponent.navigationControl.next({
                busyState: this.secondStepBusyConfig,
                allowStepChange: true,
            });
        }, 1000);
    }

    public onNextClick(): void {
        this.toastService.info({
            message: $localize`Next button clicked!`,
            title: $localize`Event`,
        });
    }

    public onCancelClick(content: TemplateRef<string>): void {
        const completeSteps = this.wizardComponent.steps
            .toArray()
            .filter((step: WizardStepComponent) => step.complete);
        if (!completeSteps.length) {
            this.toastService.info({
                message: $localize`Cancel button clicked!`,
                title: $localize`Event`,
            });
            return;
        }
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
        });
    }

    public onFinishClick(): void {
        this.toastService.info({
            message: $localize`Finish button clicked!`,
            title: $localize`Event`,
        });
    }

    public handleClick(): void {
        this.toastService.info({
            message: $localize`Additional button clicked!`,
            title: $localize`Event`,
        });
    }

    public select(event: IWizardSelectionEvent): void {
        this.selectedIndex = event.selectedIndex;
    }

    public onButtonClick(title: string): void {
        title === "Leave" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    public preventGoingNext(): void {
        this.busyConfig.busy = true;
        this.wizardComponent.navigationControl.next({
            busyState: this.busyConfig,
            allowStepChange: false,
        });
        setTimeout(() => {
            this.busyConfig.busy = false;
            this.wizardComponent.navigationControl.next({
                busyState: this.busyConfig,
                allowStepChange: true,
            });
        }, 1000);
    }

    private actionDone(): void {
        this.toastService.success({
            message: $localize`Leave Done!`,
            title: $localize`Event`,
        });
    }

    private actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Canceled!`,
            title: $localize`Event`,
        });
    }
}
