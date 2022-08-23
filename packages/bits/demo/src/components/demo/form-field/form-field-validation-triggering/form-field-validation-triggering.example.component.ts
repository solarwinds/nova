import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-form-field-validation-triggering-example",
    templateUrl: "./form-field-validation-triggering.example.component.html",
})
export class FormFieldValidationTriggeringxampleComponent implements OnInit {
    public reactiveForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit() {
        this.reactiveForm = this.formBuilder.group({
            email: this.formBuilder.control(""),
        });
    }

    public onAddValidators() {
        this.reactiveForm
            .get("email")
            ?.setValidators([Validators.required, Validators.email]);
    }

    public onTouch() {
        if (
            this.reactiveForm.get("email")?.value === "" &&
            this.reactiveForm.get("email")?.errors === null &&
            this.reactiveForm.get("email")?.validator
        ) {
            this.reactiveForm.get("email")?.setErrors({ required: true });
        }
        this.reactiveForm.get("email")?.markAsTouched();
    }

    public onValueChange() {
        const text =
            this.reactiveForm.get("email")?.value === ""
                ? "some text here"
                : "";
        this.reactiveForm.get("email")?.setValue(text);
    }

    public onStatusChange() {
        const errors = this.reactiveForm.valid ? { hasError: true } : null;
        this.reactiveForm.get("email")?.setErrors(errors);
    }

    public onReset() {
        this.reactiveForm.get("email")?.reset("");
        this.reactiveForm.get("email")?.setErrors(null);
        this.reactiveForm.get("email")?.setValidators(null);
    }
}
