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

import { Component, inject } from "@angular/core";
import moment from "moment/moment";

import { HistoryStorage, ITimeframe } from "@nova-ui/bits";

@Component({
    selector: "nui-convenience-time-frame-bar-test",
    templateUrl: "./time-frame-bar-test.component.html",
    providers: [HistoryStorage],
    standalone: false,
})
export class TimeFrameBarTestComponent {
    history = inject<HistoryStorage<ITimeframe>>(HistoryStorage);

    private baseDate = moment([2018, 5, 1, 15, 0, 0]);
    public fromDate = this.baseDate.clone().subtract(1, "month");
    public toDate = moment([2050]);
    public timeFrame: ITimeframe;

    constructor() {
        this.resetDefault();
    }

    public onChange(value?: ITimeframe): void {
        this.timeFrame = this.history.restart(value);
    }

    public zoomIn(): void {
        this.timeFrame = this.history.save({
            startDatetime: this.timeFrame.startDatetime.clone().add(1, "day"),
            endDatetime: this.timeFrame.endDatetime.clone().subtract(1, "day"),
        });
    }

    public resetDefault(): void {
        this.onChange({
            startDatetime: this.baseDate.clone().subtract(1, "week"),
            endDatetime: this.baseDate.clone(),
        });
    }
}
