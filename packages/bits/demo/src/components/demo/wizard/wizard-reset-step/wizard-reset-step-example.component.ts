import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IWizardSelectionEvent, WizardComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-reset-step-example",
    templateUrl: "./wizard-reset-step.example.component.html",
})

export class WizardResetStepExampleComponent implements OnInit {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    public myForm: FormGroup;
    public secondStepForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            name: this.formBuilder.control("", Validators.required),
            email: this.formBuilder.control("", [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*"),
                Validators.email,
            ]),
            password: this.formBuilder.control("", [Validators.required]),
        });
        this.secondStepForm = this.formBuilder.group({
            formCheckbox: [false, [Validators.requiredTrue]],
        });
    }

    public updateValidity(): void {
        this.secondStepForm.get("formCheckbox")?.updateValueAndValidity();
    }

    public onSelectionChange(event: IWizardSelectionEvent): void {
        const { selectedIndex, previouslySelectedStep, previouslySelectedIndex } = event;

        /* Example of reset statuses of second step */
        if (selectedIndex === 0 && previouslySelectedIndex === 1) {
            if (this.secondStepForm.invalid) {
                this.wizardComponent.resetStep(previouslySelectedStep);
            }
        }
    }
}
