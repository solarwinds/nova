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
    WizardComponent,
    WizardStepComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-visual",
    templateUrl: "./wizard-visual-test.component.html",
})
export class WizardVisualTestComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("dialogWizardBusy") dialogWizardBusy: WizardComponent;

    public myForm;
    public hint = "example-hint";
    public caption = "example-caption";
    public secondStepBusyConfig: IBusyConfig = {
        busy: false,
        message: "Step is busy",
    };
    public busyConfig: IBusyConfig = {
        busy: false,
        message: "Step is busy",
    };
    public selectedIndex: number;

    private activeDialog: NuiDialogRef;

    constructor(
        private formBuilder: FormBuilder,
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

    public onCancelClick(content: TemplateRef<string>): void {
        const completeSteps = this.wizardComponent.steps
            .toArray()
            .filter((step: WizardStepComponent) => step.complete);
        if (completeSteps.length) {
            this.activeDialog = this.dialogService.open(content, {
                size: "sm",
            });
        }
    }

    public select(event: IWizardSelectionEvent): void {
        this.selectedIndex = event.selectedIndex;
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

    public openDialog(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, { size: "lg" });
    }

    public closeDialog(): void {
        this.activeDialog.close();
    }

    public makeStepBusy(): void {
        this.busyConfig.busy = true;
        this.dialogWizardBusy.navigationControl.next({
            busyState: this.busyConfig,
            allowStepChange: false,
        });
    }
}
