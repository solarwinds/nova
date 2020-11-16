import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-nested-forms-as-component-example",
    templateUrl: "./nested-forms-as-component.example.component.html",
})
export class NestedFormsAsComponentExampleComponent implements OnInit {
    public fancyForm: FormGroup;

    constructor(private fb: FormBuilder,
                @Inject(ToastService) private toastService: ToastService) {}

    ngOnInit() {

        this.fancyForm = this.fb.group({
            nickname: this.fb.control ("", [Validators.required, Validators.min(3)]),
        });
    }

    formInitialized(name: string, form: FormGroup) {
        this.fancyForm.setControl(name, form);
    }
    public onSubmit(value: FormGroup) {
        this.toastService.success({
            message: `Form is valid: ${value.valid}`,
            title: "Submit",
        });
    }
}

/**
 * Component representing form group for name and surname
 */
@Component({
    selector: "nui-first-custom-form-example",
    template: `<div [formGroup]="firstForm">
        <nui-form-field class="d-block mb-4"
                        caption="First Name" i18n-caption
                        [control]="firstForm.controls['firstName']">
            <nui-textbox formControlName="firstName"></nui-textbox>
            <nui-validation-message for="required" i18n>
                This is required
            </nui-validation-message>
        </nui-form-field>
        <nui-form-field class="d-block mb-4"
                        caption="Last Name" i18n-caption
                        [control]="firstForm.controls['lastName']">
            <nui-textbox formControlName="lastName"></nui-textbox>
            <nui-validation-message for="required" i18n>
                This is required
            </nui-validation-message>
        </nui-form-field>
    </div>`,
})
export class FirstCustomFormExampleComponent implements OnInit {
    @Output() formReady = new EventEmitter<FormGroup>();
    public firstForm: FormGroup;

    ngOnInit() {
        this.firstForm = this.fb.group({
            firstName: this.fb.control ("", Validators.required),
            lastName: this.fb.control ("", Validators.required),
        });

        this.formReady.emit(this.firstForm);
    }

    constructor(private fb: FormBuilder) {}
}

/**
 * Component representing address form group
 */
@Component({
    selector: "nui-second-custom-form-example",
    template: `
        <div [formGroup]="secondForm">
            <nui-form-field class="d-block mb-4"
                            caption="City" i18n-caption
                            [control]="secondForm.controls['city']">
                <nui-textbox formControlName="city"></nui-textbox>
                <nui-validation-message for="required" i18n>
                    This is required
                </nui-validation-message>
            </nui-form-field>
            <nui-form-field class="d-block mb-4"
                            caption="Address" i18n-caption
                            [control]="secondForm.controls['address']">
                <nui-textbox formControlName="address"></nui-textbox>
                <nui-validation-message for="required" i18n>
                    This is required
                </nui-validation-message>
            </nui-form-field>
        </div>`,
})
export class SecondCustomFormExampleComponent implements OnInit {
    @Output() formReady = new EventEmitter<FormGroup>();
    public secondForm: FormGroup;

    ngOnInit() {
        this.secondForm = this.fb.group({
            city: null,
            address: null,
        });

        this.formReady.emit(this.secondForm);
    }

    constructor(private fb: FormBuilder) {}
}
