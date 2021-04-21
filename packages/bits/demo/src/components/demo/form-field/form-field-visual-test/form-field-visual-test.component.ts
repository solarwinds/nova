import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-form-field-visual-test",
    templateUrl: "./form-field-visual-test.component.html",
})

export class FormFieldVisualTestComponent implements OnInit {
    public fancyForm: FormGroup;

    public vegetables = ["Cabbage", "Potato", "Tomato", "Carrot"];

    constructor(private formBuilder: FormBuilder) {}
    public ngOnInit() {
        this.fancyForm = this.formBuilder.group({
            nickname:       this.formBuilder.control("",    [Validators.required, Validators.min(3)]),
            city:           this.formBuilder.control(""),
            textbox:        this.formBuilder.control("",    [Validators.required]),
            checkbox:       this.formBuilder.control(false, [Validators.requiredTrue]),
            checkboxGroup:  this.formBuilder.control("",    [Validators.required]),
            radioGroup:     this.formBuilder.control(null,  [Validators.required]),
            switch:         this.formBuilder.control(false, [Validators.requiredTrue]),
            select:         this.formBuilder.control("",    [Validators.required]),
            combobox:       this.formBuilder.control("",    [Validators.required]),
            timePicker:     this.formBuilder.control("",    [Validators.required]),
        });
    }

    formInitialized(name: string, form: FormGroup) {
        this.fancyForm.setControl(name, form);
    }

    markAsTouched() {
        Object.keys(this.fancyForm.controls).forEach(key => {
            this.fancyForm.controls[key].markAsDirty();
            this.fancyForm.controls[key].updateValueAndValidity();
        });
    }
}
