import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-form-field-validation-triggering-example",
    templateUrl: "./form-field-validation-triggering.example.component.html",
})
export class FormFieldValidationTriggeringxampleComponent implements OnInit {
    public reactiveForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.reactiveForm = this.formBuilder.group({
            email: this.formBuilder.control(""),
        });
    }

    public onAddValidators(): void {
        this.reactiveForm.get("email")?.setValidators([
            Validators.required,
            Validators.email,
        ]);
    }

    public onTouch(): void {
        const controlEmail = this.reactiveForm.get("email");
        if (controlEmail) {
            if (controlEmail.value === "" && controlEmail.errors === null && controlEmail.validator) {
                controlEmail.setErrors({ required: true });
            }
            controlEmail.markAsTouched();
        }
    }

    public onValueChange(): void {
        const text = this.reactiveForm.get("email")?.value === "" ? "some text here" : "";
        this.reactiveForm.get("email")?.setValue(text);
    }

    public onStatusChange(): void {
        const errors = this.reactiveForm.valid ? { hasError: true } : null;
        this.reactiveForm.get("email")?.setErrors(errors);
    }

    public onReset(): void {
        this.reactiveForm.get("email")?.reset("");
        this.reactiveForm.get("email")?.setErrors(null);
        this.reactiveForm.get("email")?.setValidators(null);
    }
}
