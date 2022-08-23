import { Component } from "@angular/core";
import moment from "moment/moment";

import { HistoryStorage, ITimeframe } from "@nova-ui/bits";

@Component({
    selector: "nui-convenience-time-frame-bar-test",
    templateUrl: "./time-frame-bar-test.component.html",
    providers: [HistoryStorage],
})
export class TimeFrameBarTestComponent {
    private baseDate = moment([2018, 5, 1, 15, 0, 0]);
    public fromDate = this.baseDate.clone().subtract(1, "month");
    public toDate = moment([2050]);
    public timeFrame: ITimeframe;

    constructor(public history: HistoryStorage<ITimeframe>) {
        this.resetDefault();
    }

    public onChange(value?: ITimeframe) {
        this.timeFrame = this.history.restart(value);
    }

    public zoomIn() {
        this.timeFrame = this.history.save({
            startDatetime: this.timeFrame.startDatetime.clone().add(1, "day"),
            endDatetime: this.timeFrame.endDatetime.clone().subtract(1, "day"),
        });
    }

    public resetDefault() {
        this.onChange({
            startDatetime: this.baseDate.clone().subtract(1, "week"),
            endDatetime: this.baseDate.clone(),
        });
    }
}
