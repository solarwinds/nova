import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "time-picker-visual-test",
    templateUrl: "./time-picker-visual-test.component.html",
})

export class TimePickerVisualTestComponent implements OnInit {
    public time: Moment;
    public myTime: Moment;
    public myForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.myTime = moment("2018-12-14T12:00:00+02:00");
    }

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            timePickerFormControl: this.formBuilder.control(this.time, [Validators.required]),
        });
    }

    public valueChange(time: any): void {
        this.time = time;
    }
}
