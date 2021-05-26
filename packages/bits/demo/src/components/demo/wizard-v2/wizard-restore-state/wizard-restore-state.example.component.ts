import { Component, Inject, OnInit, QueryList, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DialogService, NuiDialogRef, WizardHorizontalComponent, WizardStepV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-restore-state-example",
    templateUrl: "./wizard-restore-state.example.component.html",
})
export class WizardRestoreStateExampleComponent implements OnInit {
    public form: FormGroup;
    public activeDialog: NuiDialogRef;
    public stepsToRestore: QueryList<WizardStepV2Component> | null;

    @ViewChild("wizard", { static: false }) wizard: WizardHorizontalComponent;

    constructor(private formBuilder: FormBuilder,
                @Inject(DialogService) private dialogService: DialogService) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            "personDetails": this.formBuilder.group({
                "name": [
                    "",
                    [Validators.required, Validators.minLength(3)],
                ],
                "privacy": ["", [Validators.required]],
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

    public onWizardDestroy(steps: QueryList<WizardStepV2Component>): void {
        this.stepsToRestore = steps;
    }

    public completeWizard(step: WizardStepV2Component): void {
        step.completed = true;
        this.activeDialog.close();
    }

    public resetStep(step: WizardStepV2Component): void {
        step.reset();
    }
}
