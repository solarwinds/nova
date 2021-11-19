import { Component } from "@angular/core";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-time-picker-inline-example",
    templateUrl: "./date-time-picker-inline.example.component.html",
})

export class DateTimePickerInlineExampleComponent {
    public dt: Moment;
    public selectedDate: Date;
    constructor() {
        this.dt = moment();
        this.selectedDate = new Date(this.dt.valueOf());
    }

    onModelChanged(event: any): void {
        this.selectedDate = new Date(event.valueOf());
    }
}
