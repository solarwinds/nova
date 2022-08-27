import { Component } from "@angular/core";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-time-picker-disabled-example",
    templateUrl: "./date-time-picker-disabled.example.component.html",
})
export class DateTimePickerDisabledExampleComponent {
    public dt: Moment;
    public selectedDate: Date;
    constructor() {
        this.dt = moment();
        this.selectedDate = new Date(this.dt.valueOf());
    }

    onModelChanged(event: any) {
        this.selectedDate = new Date(event.valueOf());
    }
}
