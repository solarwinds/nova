import { Component } from "@angular/core";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-time-picker-range-values-example",
    templateUrl: "./date-time-picker-range-values.example.component.html",
})

export class DateTimePickerRangeValuesExampleComponent {
    private currentDate = moment();

    public dt: Moment;
    public selectedDate: Date;
    public minDate: Moment = this.currentDate.clone().date(5);
    public maxDate: Moment = this.currentDate.clone().date(25);

    constructor() {
        this.dt = moment();
        this.selectedDate = new Date(this.dt.valueOf());
    }

    onModelChanged(event: any) {
        this.selectedDate = new Date(event.valueOf());
    }
}
