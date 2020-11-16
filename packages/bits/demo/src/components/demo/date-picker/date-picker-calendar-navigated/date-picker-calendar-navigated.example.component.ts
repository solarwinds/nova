import { Component } from "@angular/core";
import { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-calendar-navigated-example",
    templateUrl: "./date-picker-calendar-navigated.example.component.html",
})
export class DatePickerCalendarNavigatedExampleComponent {
    public calendarChangedDate: Date;

    public dateChanged(event: Moment) {
        this.calendarChangedDate = new Date(event.valueOf());
    }
}
