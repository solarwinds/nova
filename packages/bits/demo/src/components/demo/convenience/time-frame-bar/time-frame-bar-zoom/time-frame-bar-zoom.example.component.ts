import { Component, OnInit } from "@angular/core";
import moment, { DurationInputArg2, Moment } from "moment/moment";

import { HistoryStorage, ITimeframe } from "@nova-ui/bits";

@Component({
    selector: "nui-convenience-time-frame-bar-zoom-example",
    templateUrl: "./time-frame-bar-zoom.example.component.html",
    providers: [HistoryStorage],
})
export class TimeFrameBarZoomExampleComponent implements OnInit {
    public minDate: Moment;
    public maxDate: Moment;

    public timeFrame: ITimeframe;

    private baseDate = moment([2018, 5, 1, 15, 0, 0]);
    private zoomLevels: DurationInputArg2[] = [
        "weeks",
        "days",
        "hours",
        "minutes",
    ];

    // Inject an instance of HistoryStorage
    constructor(public history: HistoryStorage<ITimeframe>) {}

    public ngOnInit() {
        // Set the minimum and maximum selectable dates
        this.minDate = this.baseDate.clone().subtract(1, "months");
        this.maxDate = moment();

        // Set the initial time frame
        this.onChange(this.getTimeFrame(this.zoomLevels[0]));
    }

    // Save the new timeframe to the history storage and set it as the current timeFrame
    public onZoomIn = () =>
        (this.timeFrame = this.history.save(
            this.getTimeFrame(this.zoomLevels[this.history.index + 1])
        ));

    // Use the history storage to go back one time frame
    public onUndo = () => (this.timeFrame = this.history.undo());

    // Reset the history storage and save a new initial value if provided
    // Otherwise preserve the previous one
    public onChange = (value?: ITimeframe) =>
        (this.timeFrame = this.history.restart(value));

    // This method is for demo purposes only
    public canZoom() {
        const expectedTF = this.getTimeFrame(
            this.zoomLevels[this.history.index]
        );
        const matchesZoomLevel =
            this.timeFrame.startDatetime.isSame(expectedTF.startDatetime) &&
            this.timeFrame.endDatetime.isSame(expectedTF.endDatetime);
        return (
            matchesZoomLevel && this.history.index < this.zoomLevels.length - 1
        );
    }

    // This method is for demo purposes only
    private getTimeFrame(zoomLevel: DurationInputArg2): ITimeframe {
        return {
            startDatetime: this.baseDate.clone().subtract(1, zoomLevel),
            endDatetime: this.baseDate.clone().add(1, zoomLevel),
        };
    }
}
