import { Component, Inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    DialogService, IBusyConfig, IWizardSelectionEvent, NuiDialogRef, WizardComponent, WizardStepComponent
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

    constructor(private formBuilder: FormBuilder,
                @Inject(DialogService) private dialogService: DialogService) {}

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            name: this.formBuilder.control("",
                                           Validators.required),
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
        this.wizardComponent.navigationControl.next({ busyState: this.secondStepBusyConfig, allowStepChange: false});
        setTimeout(() => {
            this.secondStepBusyConfig.busy = false;
            this.wizardComponent.navigationControl.next({ busyState: this.secondStepBusyConfig, allowStepChange: true});
        }, 1000);
    }

    public onCancelClick(content: TemplateRef<string>) {
        if (this.wizardComponent.steps.toArray().filter((step: WizardStepComponent) => step.complete).length !== 0) {
            this.activeDialog = this.dialogService.open(content, {size: "sm"});
        }
    }

    public select(event: IWizardSelectionEvent) {
        this.selectedIndex = event.selectedIndex;
    }

    public preventGoingNext() {
        this.busyConfig.busy = true;
        this.wizardComponent.navigationControl.next({ busyState: this.busyConfig, allowStepChange: false});
        setTimeout(() => {
            this.busyConfig.busy = false;
            this.wizardComponent.navigationControl.next({ busyState: this.busyConfig, allowStepChange: true});
        }, 1000);
    }

    public openDialog(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {size: "lg"});
    }

    public closeDialog() {
        this.activeDialog.close();
    }

    public makeStepBusy() {
        this.busyConfig.busy = true;
        this.dialogWizardBusy.navigationControl.next({ busyState: this.busyConfig, allowStepChange: false});
    }
}
