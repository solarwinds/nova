import {Component, Inject, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {
    DialogService,
    NuiDialogRef,
    ToastService,
    WizardHorizontalComponent,
} from "@nova-ui/bits";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "nui-wizard-with-confirmation-dialog-on-cancel-example",
    templateUrl: "./wizard-with-confirmation-dialog-on-cancel.component.html",
    styleUrls: ["./wizard-with-confirmation-dialog-on-cancel.component.less"],
})
export class WizardWithConfirmationDialogOnCancelComponent implements OnInit{
    public confirmationDialog: NuiDialogRef;
    public form: FormGroup;

    @ViewChild("wizard") private wizard: WizardHorizontalComponent;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        private toastService: ToastService,
        private formBuilder: FormBuilder) {}

    public ngOnInit(): void {
        this.initForm();
    }

    public openConfirmationDialog(content: TemplateRef<string>): void {
        this.confirmationDialog = this.dialogService.open(content, {
            size: "sm",
            windowClass: "active-dialog",
        });
    }

    public resetWizard(): void {
        this.wizard.reset();
    }

    public validate(formGroup: string): void {
        this.form.get(formGroup)?.markAllAsTouched();
    }

    public onSubmit(): void {
        this.toastService.info({
            title: $localize `Form was successfully submitted.`,
            options: {
                timeOut: 5000,
                extendedTimeOut: 2000,
            },
        });
        this.wizard.reset();
    }

    private initForm(): void {
        this.form = new FormGroup({
            "personDetails": this.formBuilder.group({
                "firstName": ["", [Validators.required, Validators.minLength(3)]],
                "lastName": ["", [Validators.required, Validators.minLength(3)]],
            }),
            "contactDetails": this.formBuilder.group({
                "email": ["", [Validators.required, Validators.email]],
                "phone": [""],
            }),
            "confirm": this.formBuilder.group({
                "confirmed": [false, Validators.requiredTrue],
            }),
        });
    }
}
