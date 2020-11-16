import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
    selector: "nui-form-field-complex-example",
    templateUrl: "./form-field-complex.example.component.html",
})
export class FormFieldComplexExampleComponent implements OnInit {
    public fancyForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private changeDetector: ChangeDetectorRef) {
    }

    public ngOnInit() {

        this.fancyForm = this.formBuilder.group({
            password: this.formBuilder.control("", Validators.required),
            confirmPassword: this.formBuilder.control("", Validators.required),
        }, {
            validator: this.matchPassword.bind(this.formBuilder.group),
        });
    }

    private matchPassword(group: FormGroup) {
        const password = group.controls.password;
        const confirm = group.controls.confirmPassword;
        if (password.pristine || confirm.pristine) {
            return null;
        }

        group.markAsTouched();

        if (password.value === confirm.value) {
            return null;
        }

        return {
            isValid: false,
        };
    }
}
