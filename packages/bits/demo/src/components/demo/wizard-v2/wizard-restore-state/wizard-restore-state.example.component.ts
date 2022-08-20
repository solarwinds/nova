import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    DialogService,
    NuiDialogRef,
    WizardStepV2Component,
    IWizardState,
    ToastService,
} from "@nova-ui/bits";
import isEqual from "lodash/isEqual";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
    public form: FormGroup;
    public activeDialog: NuiDialogRef;
    public state: IWizardState;
    public dynamicSteps: IWizardStepData[] = [];
    public awesome: boolean = false;

    private destroy$: Subject<any> = new Subject();

    @ViewChild("dynamicTemplate1") public template1: TemplateRef<string>;
    @ViewChild("dynamicTemplate2") public template2: TemplateRef<string>;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(DialogService) private dialogService: DialogService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
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

    ngOnDestroy(): void {
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
