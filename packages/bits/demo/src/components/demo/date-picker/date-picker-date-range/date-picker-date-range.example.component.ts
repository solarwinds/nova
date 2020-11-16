import { Component } from "@angular/core";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-date-range-example",
    templateUrl: "./date-picker-date-range.example.component.html",
})
export class DatePickerDateRangeExampleComponent {
    private currentDate = moment();

    public minDate: Moment = this.currentDate.clone().date(5);
    public maxDate: Moment = this.currentDate.clone().date(25);
}
