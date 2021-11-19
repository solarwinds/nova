import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "date-picker-visual-test",
    templateUrl: "./date-picker-visual-test.component.html",
})
export class DatePickerVisualTestComponent implements OnInit {
    public myForm: FormGroup;
    public initDate: Moment = moment().set({
        year: 2017,
        month: 11,
        date: 23,
        hour: 15,
        minute: 30,
    });
    public emptyDate = moment("");

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            datePickerFormControl: this.formBuilder.control(this.emptyDate, [Validators.required]),
        });
    }
}
