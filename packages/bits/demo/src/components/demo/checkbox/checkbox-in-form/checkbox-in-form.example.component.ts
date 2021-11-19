import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-checkbox-in-form-example",
    templateUrl: "./checkbox-in-form.example.component.html",
})
export class CheckboxInFormExampleComponent implements OnInit {
    public myForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) { }

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            checkbox: this.formBuilder.control(false, Validators.requiredTrue),
        });
    }

    public onSubmit(): void {
        this.toastService.success({ message: $localize`Your form is valid!` });
    }
}
