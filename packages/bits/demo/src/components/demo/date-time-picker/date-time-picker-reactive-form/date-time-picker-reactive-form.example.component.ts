import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-time-picker-reactive-forms-example",
    templateUrl: "./date-time-picker-reactive-form.example.component.html",
})

export class DateTimePickerReactiveFormExampleComponent {
    public dt: Moment = moment();
    public selectedDate: Date = new Date(this.dt.valueOf());
    public control = new FormControl(this.dt, Validators.required);

    constructor() { }

    onModelChanged(event: Moment): void {
        this.selectedDate = new Date(event.valueOf());
    }
}
