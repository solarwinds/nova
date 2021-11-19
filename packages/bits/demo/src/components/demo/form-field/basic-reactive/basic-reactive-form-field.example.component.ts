import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-form-field-basic-reactive-example",
    templateUrl: "./basic-reactive-form-field.example.component.html",
})
export class FormFieldBasicReactiveExampleComponent implements OnInit {
    public reactiveForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.reactiveForm = this.formBuilder.group({
            email: this.formBuilder.control("", [
                Validators.required,
                Validators.email,
            ]),
        });
    }
}
