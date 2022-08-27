import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-reactive-forms-example",
    templateUrl: "./date-picker-reactive-form.example.component.html",
})
export class DatePickerReactiveFormExampleComponent {
    public dt: Moment = moment();
    public selectedDate: Date = new Date(this.dt.valueOf());
    public control = new FormControl(this.dt, Validators.required);

    constructor() {}

    onValueChange(event: Moment) {
        this.selectedDate = new Date(event.valueOf());
    }
}
