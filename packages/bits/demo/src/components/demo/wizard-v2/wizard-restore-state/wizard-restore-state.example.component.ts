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
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import isEqual from "lodash/isEqual";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    DialogService,
    IWizardState,
    NuiDialogRef,
    ToastService,
    WizardStepV2Component,
} from "@nova-ui/bits";

interface IWizardStepData {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-restore-state-example",
    templateUrl: "./wizard-restore-state.example.component.html",
    styleUrls: ["wizard-restore-state.example.component.less"],
})
export class WizardRestoreStateExampleComponent implements OnInit, OnDestroy {
    public form;
    public activeDialog: NuiDialogRef;
    public state: IWizardState;
    public dynamicSteps: IWizardStepData[] = [];
    public awesome: boolean = false;
    @ViewChild("dynamicTemplate1") public template1: TemplateRef<string>;
    @ViewChild("dynamicTemplate2") public template2: TemplateRef<string>;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        @Inject(DialogService) private dialogService: DialogService,
        private toastService: ToastService
    ) {
        this.form = this.formBuilder.group({
            personDetails: this.formBuilder.group({
                name: ["", [Validators.required, Validators.minLength(3)]],
                privacy: [false, [Validators.requiredTrue]],
            }),
            organization: this.formBuilder.group({
                title: ["", [Validators.required]],
                date: ["", [Validators.required]],
                createDynamicStep1: [false],
                createDynamicStep2: [false],
            }),
            contactDetails: this.formBuilder.group({
                email: ["", [Validators.required, Validators.email]],
                options: [""],
            }),
        });
    }

    public ngOnInit(): void {
        this.form
            .get(["organization", "createDynamicStep1"])
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                this.handleDynamicSteps(
                    "I was created dynamically!",
                    this.template1,
                    changes
                );
            });

        this.form
            .get(["organization", "createDynamicStep2"])
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                this.handleDynamicSteps(
                    "Another dynamic step",
                    this.template2,
                    changes
                );
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public openDialog(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, { size: "lg" });
    }

    public closeDialog(): void {
        this.activeDialog.close();
    }

    public saveState(state: IWizardState): void {
        this.state = state;
    }

    public completeWizard(
        formControlName: string,
        step: WizardStepV2Component
    ): void {
        this.validateStep(formControlName);

        if (!this.form.valid) {
            return;
        }

        step.completed = true;
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Wizard was completed successfully`,
            options: {
                timeOut: 2000,
            },
        });
        this.activeDialog.close();
    }

    public resetStep(step: WizardStepV2Component): void {
        step.reset();
    }

    private validateStep(formGroup: string): void {
        this.form.get(formGroup)?.markAllAsTouched();
    }

    private handleDynamicSteps(
        title: string,
        template: TemplateRef<string>,
        controlValue: boolean
    ) {
        const newStep: IWizardStepData = {
            title: title,
            templateRef: template,
        };
        const index = this.dynamicSteps.findIndex((step) =>
            isEqual(step, newStep)
        );

        controlValue
            ? this.dynamicSteps.push({ ...newStep })
            : this.dynamicSteps.splice(index, 1);
    }
}
