// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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

    public ngOnInit(): void {
        // Set the minimum and maximum selectable dates
        this.minDate = this.baseDate.clone().subtract(1, "months");
        this.maxDate = moment();

        // Set the initial time frame
        this.onChange(this.getTimeFrame(this.zoomLevels[0]));
    }

    // Save the new timeframe to the history storage and set it as the current timeFrame
    public onZoomIn = (): void => {
        this.timeFrame = this.history.save(
            this.getTimeFrame(this.zoomLevels[this.history.index + 1])
        );
    };

    // Use the history storage to go back one time frame
    public onUndo = (): void => {
        this.timeFrame = this.history.undo();
    };

    // Reset the history storage and save a new initial value if provided
    // Otherwise preserve the previous one
    public onChange = (value?: ITimeframe): void => {
        this.timeFrame = this.history.restart(value);
    };

    // This method is for demo purposes only
    public canZoom(): boolean {
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
