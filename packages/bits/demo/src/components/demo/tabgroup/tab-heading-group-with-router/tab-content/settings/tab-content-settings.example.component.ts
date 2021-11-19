import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-content-settings-example",
    templateUrl: "./tab-content-settings.example.component.html",
})
export class TabContentSettingsExampleComponent implements OnInit {
    public content: string = "You can change your password using the form below:";
    public tabTitle: string = "Account Settings";

    public dynamicForm: FormGroup;
    public visibleRadio: boolean;

    constructor(private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.dynamicForm = this.formBuilder.group({
            password: this.formBuilder.control("", Validators.required),
            confirmPassword: this.formBuilder.control({ value: "", disabled: true }, Validators.required),
        });
    }

    public onPasswordBlurred(): void {
        if (this.dynamicForm.controls.password.valid) {
            this.dynamicForm.controls.confirmPassword.enable();
        } else {
            this.dynamicForm.controls.confirmPassword.disable();
        }
    }

    public toggleRadio(): void {
        this.visibleRadio = !this.visibleRadio;
    }
}
