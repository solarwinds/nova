import { Component, OnInit } from "@angular/core";
import { ITimeframe } from "@nova-ui/bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-convenience-time-frame-bar-basic-example",
    templateUrl: "./time-frame-bar-basic.example.component.html",
})
export class TimeFrameBarBasicExampleComponent implements OnInit {
    public minDate: Moment;
    public maxDate: Moment;
    public timeFrame: ITimeframe;

    private baseDate = moment([2018, 5, 1, 15, 0, 0]);

    public ngOnInit() {
        // Set the minimum and maximum selectable dates (optional)
        this.minDate = this.baseDate.clone().subtract(1, "months");
        this.maxDate = moment();

        // Set the initial time frame
        this.timeFrame = {
            startDatetime: this.baseDate.clone().subtract(1, "weeks"),
            endDatetime: this.baseDate.clone(),
        };
    }
}
