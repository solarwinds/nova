import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-form-field-dynamic-disabling-example",
    templateUrl: "./form-field-dynamic-disabling.example.component.html",
})
export class FormFieldDynamicDisablingExampleComponent implements OnInit {
    public dynamicForm: FormGroup;
    public visibleRadio: boolean;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public ngOnInit() {
        this.dynamicForm = this.formBuilder.group({
            password: this.formBuilder.control("", Validators.required),
            confirmPassword: this.formBuilder.control(
                { value: "", disabled: true },
                Validators.required
            ),
        });
    }

    public onPasswordBlurred() {
        if (this.dynamicForm.controls.password.valid) {
            this.dynamicForm.controls.confirmPassword.enable();
        } else {
            this.dynamicForm.controls.confirmPassword.disable();
        }
    }

    public toggleRadio() {
        this.visibleRadio = !this.visibleRadio;
    }
}
