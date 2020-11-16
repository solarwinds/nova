import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-form-field-basic-reactive-custom-validation-example",
    templateUrl: "./basic-reactive-form-field-custom-validation.example.component.html",
})
export class FormFieldBasicReactiveCustomValidationExampleComponent implements OnInit {
    public reactiveForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    public ngOnInit() {
        this.reactiveForm = this.formBuilder.group({
            email: this.formBuilder.control("", [
                Validators.required,
                Validators.email,
            ]),
        });
    }
}
