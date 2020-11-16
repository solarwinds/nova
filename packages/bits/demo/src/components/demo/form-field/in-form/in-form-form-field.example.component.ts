import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import moment from "moment/moment";

@Component({
    selector: "nui-form-field-in-form-example",
    templateUrl: "./in-form-form-field.example.component.html",
})
export class FormFieldInFormExampleComponent implements OnInit {
    public fancyForm: FormGroup;

    public vegetables = [$localize `Cabbage`, $localize `Potato`, $localize `Tomato`, $localize `Carrot`];

    constructor(private formBuilder: FormBuilder,
                private changeDetector: ChangeDetectorRef) {}
    public ngOnInit() {
        this.fancyForm = this.formBuilder.group({
            textbox: this.formBuilder.control("", [
                Validators.required,
            ]),
            textNumber: this.formBuilder.control(0, [
                Validators.required,
            ]),
            checkbox: this.formBuilder.control(true, [
                Validators.requiredTrue,
            ]),
            checkboxGroup: this.formBuilder.control(["Cabbage", "Potato"] , [
                Validators.required,
            ]),
            radioGroup: this.formBuilder.control(this.vegetables[1], [
                Validators.required,
            ]),
            switch: this.formBuilder.control(false, [ Validators.requiredTrue,
            ]),
            select: this.formBuilder.control("", [
                Validators.required,
            ]),
            combobox: this.formBuilder.control("", [
                Validators.required,
            ]),
            datePicker: this.formBuilder.control(moment()),
            timePicker: this.formBuilder.control("", [
                Validators.required,
            ]),
            dateTimePicker: this.formBuilder.control(moment(), [
                Validators.required,
            ]),
        });
    }
}
