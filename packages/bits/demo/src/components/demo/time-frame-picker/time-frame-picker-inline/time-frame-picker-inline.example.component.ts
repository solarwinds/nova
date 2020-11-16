import { Component } from "@angular/core";
import { ITimeframe } from "@solarwinds/nova-bits";
import moment from "moment/moment";

@Component({
    selector: "nui-time-frame-picker-inline",
    templateUrl: "./time-frame-picker-inline.example.component.html",
})

export class TimeFramePickerInlineExampleComponent {
    public tf: ITimeframe = {
        startDatetime: moment("04/09/2018", "L"),
        endDatetime: moment("04/10/2018", "L"),
        // @ts-ignore
        selectedPresetId: null,
    };

    public minDate = moment("04/07/2018", "L"); // "L" is "MM/DD/YYY" in moment.js
    public maxDate = moment();

    public updateTf(value: any) {
        this.tf = value;
    }
}
