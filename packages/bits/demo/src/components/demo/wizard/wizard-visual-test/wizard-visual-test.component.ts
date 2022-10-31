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

import {
    Component,
    Inject,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
export class WizardVisualTestComponent implements OnInit {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("dialogWizardBusy") dialogWizardBusy: WizardComponent;

    public myForm: FormGroup;
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
    ) {}

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            name: this.formBuilder.control("", Validators.required),
            email: this.formBuilder.control("", [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*"),
            ]),
            password: this.formBuilder.control("", [
                Validators.required,
                Validators.minLength(8),
            ]),
        });
    }

    public onOptionChange(value: string) {
        this.hint = value;
    }

    public makeSecondStepBusy() {
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

    public onCancelClick(content: TemplateRef<string>) {
        if (
            this.wizardComponent.steps
                .toArray()
                .filter((step: WizardStepComponent) => step.complete).length !==
            0
        ) {
            this.activeDialog = this.dialogService.open(content, {
                size: "sm",
            });
        }
    }

    public select(event: IWizardSelectionEvent) {
        this.selectedIndex = event.selectedIndex;
    }

    public preventGoingNext() {
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

    public openDialog(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, { size: "lg" });
    }

    public closeDialog() {
        this.activeDialog.close();
    }

    public makeStepBusy() {
        this.busyConfig.busy = true;
        this.dialogWizardBusy.navigationControl.next({
            busyState: this.busyConfig,
            allowStepChange: false,
        });
    }
}
