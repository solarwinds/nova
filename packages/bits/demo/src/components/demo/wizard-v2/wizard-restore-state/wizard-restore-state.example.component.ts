import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DialogService, NuiDialogRef, WizardStepV2Component, IWizardState } from "@nova-ui/bits";
import isEqual from "lodash/isEqual";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IWizardStepConfig } from "../wizard-dynamic/wizard-dynamic.example.component";

@Component({
    selector: "nui-wizard-restore-state-example",
    templateUrl: "./wizard-restore-state.example.component.html",
})
export class WizardRestoreStateExampleComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public activeDialog: NuiDialogRef;
    public state: IWizardState;
    public dynamicSteps: IWizardStepConfig[] = [];
    public awesome: boolean = false;

    private destroy$: Subject<any> = new Subject();

    @ViewChild("dynamicTemplate1") public template1: TemplateRef<string>;
    @ViewChild("dynamicTemplate2") public template2: TemplateRef<string>;

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
                "createDynamicStep1": [false],
                "createDynamicStep2": [false],
            }),
            "contactDetails": this.formBuilder.group({
                "email": ["", [Validators.required, Validators.email]],
                "options": [""],
            }),
        });

        this.form.get(["organization", "createDynamicStep1"])?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(changes => {
                this.handleDynamicSteps("I was created dynamically!", this.template1, changes);
            });

        this.form.get(["organization", "createDynamicStep2"])?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(changes => {
                this.handleDynamicSteps("Another dynamic step", this.template2, changes);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

    private handleDynamicSteps(title: string, template: TemplateRef<string>, controlValue: boolean) {
        const newStep: IWizardStepConfig = { title: title, templateRef: template };
        const index = this.dynamicSteps.findIndex(step => isEqual(step, newStep));

        controlValue
            ? this.dynamicSteps.push({...newStep})
            : this.dynamicSteps.splice(index, 1);
    }
}
