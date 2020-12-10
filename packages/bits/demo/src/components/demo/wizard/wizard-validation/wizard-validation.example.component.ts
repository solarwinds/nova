import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { WizardComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-validation-example",
    templateUrl: "./wizard-validation.example.component.html",
})

export class WizardValidationExampleComponent implements OnInit {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    public myForm: FormGroup;
    public secondStepForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}
    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            name: this.formBuilder.control("",
                Validators.required),
            email: this.formBuilder.control("", [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*"),
                Validators.email,
            ]),
            password: this.formBuilder.control("", [
                Validators.required,
                Validators.minLength(8),
            ]),
        });
        this.secondStepForm = this.formBuilder.group({
            formCheckbox: [false, [Validators.requiredTrue]],
        });
    }

    public updateValidity() {
        this.secondStepForm.get("formCheckbox")?.updateValueAndValidity();
    }
}
