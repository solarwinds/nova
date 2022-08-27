import { Component, OnDestroy, OnInit } from "@angular/core";
import moment, { Moment } from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";

@Component({
    selector: "nui-time-picker-localized",
    templateUrl: "./time-picker-localized.example.component.html",
})
export class TimePickerLocalizedExampleComponent implements OnInit, OnDestroy {
    public minDate: Moment;
    public maxDate: Moment;
    public timeFrame: ITimeframe;

    private baseDate: Moment;
    private oldLocale: string;

    ngOnInit() {
        this.oldLocale = moment.locale();
        moment.locale(window.navigator.language);

        this.baseDate = moment([2018, 5, 1, 15, 0, 0]);
        this.minDate = this.baseDate.clone().subtract(1, "months");
        this.maxDate = moment();

        this.timeFrame = {
            startDatetime: this.baseDate.clone().subtract(1, "weeks"),
            endDatetime: this.baseDate.clone(),
            // @ts-ignore
            selectedPresetId: null,
        };
    }

    ngOnDestroy() {
        moment.locale(this.oldLocale);
    }
}
