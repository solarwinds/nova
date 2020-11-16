import { Component } from "@angular/core";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-init-date-example",
    templateUrl: "./date-picker-init-date.example.component.html",
})
export class DatePickerInitDateExampleComponent {
    public initDate: Moment = moment("2018-08-04");
}
