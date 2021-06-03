import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import moment from "moment/moment";

@Component({
    selector: "nui-form-field-test",
    templateUrl: "./form-field-test.component.html",
})
export class FormFieldTestComponent implements OnInit {
    public dynamicForm: FormGroup;

    public dateTimePickerModel: string;

    constructor(private formBuilder: FormBuilder) {
    }

    public vegetables = [$localize `Cabbage`, $localize `Potato`, $localize `Tomato`, $localize `Carrot`];

    public ngOnInit(): void {
        this.dynamicForm = this.formBuilder.group({
            textbox: this.formBuilder.control("", Validators.required),
            textboxNumber: this.formBuilder.control("", Validators.required),
            radio: this.formBuilder.control({}, Validators.required),
            checkbox: this.formBuilder.control(true, Validators.required),
            checkboxGroup: this.formBuilder.control("", Validators.required),
            switch: this.formBuilder.control(true, Validators.required),
            selectV2: this.formBuilder.control("apple", Validators.required),
            comboboxV2: this.formBuilder.control("apple", Validators.required),
            datepicker: this.formBuilder.control(moment(), Validators.required),
            timepicker: this.formBuilder.control({}, Validators.required),
            dateTimePicker: this.formBuilder.control(moment("04/09/1989", "L"), [ // "L" is "MM/DD/YYY" in moment.js
                Validators.required,
            ]),
        });
        this.dynamicForm.disable();
        this.dynamicForm.valueChanges.subscribe(value => this.dateTimePickerModel =  moment(value["dateTimePicker"]).format("LLLL"));
    }

    public toggleDisabledState(): void {
        if (this.dynamicForm.disabled) {
            this.dynamicForm.enable();
        } else {
            this.dynamicForm.disable();
        }
    }
}
