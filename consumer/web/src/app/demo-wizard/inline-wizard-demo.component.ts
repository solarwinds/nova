import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
    CheckboxChangeEvent,
    IBusyConfig,
    ISelectChangedEvent,
    IWizardSelectionEvent,
    NuiActiveDialog,
    ToastService,
    WizardComponent,
    WizardStepComponent
} from "@solarwinds/nova-bits";

@Component({
    selector: "rd-inline-wizard-demo",
    templateUrl: "./inline-wizard-demo.component.html",
})

export class InlineWizardDemoComponent implements OnInit {
    @ViewChild("wizardComponent", { static: true }) wizardComponent: WizardComponent;
    @ViewChild("step3", { static: true }) wizardStep3Component: WizardStepComponent;
    @ViewChild("step4", { static: true }) wizardStep4Component: WizardStepComponent;

    public myForm: FormGroup;
    public subscribe = ["release", "breaking change", "updates", "events"];
    public firstStepBusyConfig: IBusyConfig = {
        busy: false,
        message: "Step is busy",
    };
    public selectedIndex: number;
    public shouldReceiveNotifications = false;

    public dataset = {
        items: ["Email", "SMS", "Social Network"],
        selectedItem: "Email",
    };

    public components = [
        {component: "nui-list"},
        {component: "nui-dialog"},
        {component: "nui-wizard"},
        {component: "nui-select"},
        {component: "nui-popover"},
        {component: "nui-button"},
    ];

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                @Inject(ToastService) private toastService: ToastService,
                @Inject(NuiActiveDialog) public dialogService: NuiActiveDialog) {
    }

    public ngOnInit() {
        this.selectedIndex = 0;
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

    public valueChange(changeEvent: ISelectChangedEvent<string>) {
        this.dataset.selectedItem = changeEvent.newValue;
    }

    public makeFirstStepBusy() {
        this.firstStepBusyConfig.busy = true;
        setTimeout(() => {
            this.firstStepBusyConfig.busy = false;
        }, 3000);
    }

    public onNextClick() {
        this.toastService.info({message: "Next button clicked!", title: "Event"});
    }

    public onCancelClick() {
        this.dialogService.close();
        this.toastService.info({message: "Cancel button clicked!", title: "Event"});
    }

    public onFinishClick() {
        this.toastService.info({message: "Finish button clicked!", title: "Event"});
    }

    public handleClick() {
        if (this.myForm.valid) {
            this.makeFirstStepBusy();
        }
    }

    public select(event: IWizardSelectionEvent) {
        this.selectedIndex = event.selectedIndex;
    }

    public receiveNotificationFlagChanged(event: CheckboxChangeEvent) {
        if (event.target.checked) {
            this.wizardComponent.addStepDynamic(this.wizardStep3Component, 3);
            this.wizardComponent.addStepDynamic(this.wizardStep4Component, 4);
        }
    }

    public goToStep() {
        this.wizardComponent.goToStep(0);
    }
}
