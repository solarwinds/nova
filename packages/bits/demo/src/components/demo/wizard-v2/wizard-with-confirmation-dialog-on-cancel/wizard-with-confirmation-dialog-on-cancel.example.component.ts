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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import {
    DialogService,
    NuiDialogRef,
    ToastService,
    WizardHorizontalComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-with-confirmation-dialog-on-cancel-example",
    templateUrl:
        "./wizard-with-confirmation-dialog-on-cancel.example.component.html",
    styleUrls: [
        "./wizard-with-confirmation-dialog-on-cancel.example.component.less",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardWithConfirmationDialogOnCancelExampleComponent {
    public confirmationDialog: NuiDialogRef;
    public form;

    @ViewChild("wizard") private wizard: WizardHorizontalComponent;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        public cd: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.group({
            personDetails: this.formBuilder.group({
                firstName: ["", [Validators.required, Validators.minLength(3)]],
                lastName: ["", [Validators.required, Validators.minLength(3)]],
            }),
            contactDetails: this.formBuilder.group({
                email: ["", [Validators.required, Validators.email]],
                phone: [""],
            }),
            confirm: this.formBuilder.group({
                confirmed: [false, Validators.requiredTrue],
            }),
        });
    }

    // Open confirmation dialog
    public openConfirmationDialog(content: TemplateRef<string>): void {
        if (this.wizard.selectedIndex === 0) {
            this.resetWizard();
            return;
        }

        this.confirmationDialog = this.dialogService.open(content, {
            size: "sm",
            windowClass: "active-dialog",
        });
    }

    public resetWizard(): void {
        this.wizard.reset();
    }

    // Validate form before changing selected step
    public validate(formGroup: string): void {
        this.form.get(formGroup)?.markAllAsTouched();
    }

    public onSubmit(formControlName: string): void {
        this.validate(formControlName);

        if (!this.form.valid) {
            return;
        }

        this.toastService.info({
            title: $localize`Form was successfully submitted.`,
            options: {
                timeOut: 5000,
                extendedTimeOut: 2000,
            },
        });
        this.wizard.reset();
    }
}
