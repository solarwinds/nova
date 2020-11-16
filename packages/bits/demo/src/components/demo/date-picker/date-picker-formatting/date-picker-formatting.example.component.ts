import { Component } from "@angular/core";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-formatting-example",
    templateUrl: "./date-picker-formatting.example.component.html",
})
export class DatePickerFormattingExampleComponent {
    public initDate: Moment = moment();
}
