import { Component, Inject, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DialogService, NuiDialogRef, WizardStepV2Component, IWizardState } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-restore-state-example",
    templateUrl: "./wizard-restore-state.example.component.html",
})
export class WizardRestoreStateExampleComponent implements OnInit {
    public form: FormGroup;
    public activeDialog: NuiDialogRef;
    public state: IWizardState;

    constructor(private formBuilder: FormBuilder,
                @Inject(DialogService) private dialogService: DialogService) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            "personDetails": this.formBuilder.group({
                "name": [
                    "",
                    [Validators.required, Validators.minLength(3)],
                ],
                "privacy": [false, [Validators.requiredTrue]],
            }),
            "organization": this.formBuilder.group({
                "title": ["", [Validators.required]],
                "date": ["", [Validators.required]],
            }),
            "contactDetails": this.formBuilder.group({
                "email": ["", [Validators.required, Validators.email]],
                "options": [""],
            }),
        });
    }

    public openDialog(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {size: "lg"});
    }

    public closeDialog(): void {
        this.activeDialog.close();
    }

    public saveState(state: IWizardState): void {
        this.state = state;
    }

    public completeWizard(step: WizardStepV2Component): void {
        step.completed = true;
        this.activeDialog.close();
    }

    public resetStep(step: WizardStepV2Component): void {
        step.reset();
    }

    private validateStep(formGroup: string): void {
        this.form.get(formGroup)?.markAllAsTouched();
    }
}
