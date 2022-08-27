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
    ToastService,
    WizardComponent,
    WizardStepComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-simple-example",
    templateUrl: "./wizard-simple.example.component.html",
})
export class WizardSimpleExampleComponent implements OnInit {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("wizardStep2") wizardStep2Component: WizardStepComponent;
    @ViewChild("wizardStep3") wizardStep3Component: WizardStepComponent;
    @ViewChild("dynamicStep") dynamicStep: WizardStepComponent;

    public myForm: FormGroup;
    public hint = $localize`example-hint`;
    public caption = $localize`example-caption`;
    public vegetables = [
        $localize`Cabbage`,
        $localize`Potato`,
        $localize`Tomato`,
        $localize`Carrot`,
    ];
    public selectedVegetables = [$localize`Potato`, $localize`Tomato`];
    public secondStepBusyConfig: IBusyConfig = {
        busy: false,
        message: $localize`Step is busy`,
    };
    public busyConfig: IBusyConfig = {
        busy: false,
        message: $localize`Step is busy`,
    };
    public selectedIndex: number;

    private activeDialog: NuiDialogRef;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService,
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

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }

    public valuesChanged(values: any[]) {
        this.selectedVegetables = [...values];
    }

    public addStep() {
        this.wizardComponent.addStepDynamic(
            this.dynamicStep,
            this.selectedIndex + 1
        );
    }

    public disableSecondStep() {
        this.wizardComponent.disableStep(this.wizardStep2Component);
    }

    public hideThirdStep() {
        this.wizardComponent.hideStep(this.wizardStep3Component);
    }

    public visibleThirdStep() {
        this.wizardComponent.showStep(this.wizardStep3Component);
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

    public onNextClick() {
        this.toastService.info({
            message: $localize`Next button clicked!`,
            title: $localize`Event`,
        });
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
        } else {
            this.toastService.info({
                message: $localize`Cancel button clicked!`,
                title: $localize`Event`,
            });
        }
    }

    public onFinishClick() {
        this.toastService.info({
            message: $localize`Finish button clicked!`,
            title: $localize`Event`,
        });
    }

    public handleClick() {
        this.toastService.info({
            message: $localize`Additional button clicked!`,
            title: $localize`Event`,
        });
    }

    public select(event: IWizardSelectionEvent) {
        this.selectedIndex = event.selectedIndex;
    }
    public onButtonClick(title: string) {
        title === "Leave" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
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

    private actionDone(): void {
        this.toastService.success({
            message: $localize`Leave Done!`,
            title: $localize`Event`,
        });
    }

    private actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Canceled!`,
            title: $localize`Event`,
        });
    }
}
