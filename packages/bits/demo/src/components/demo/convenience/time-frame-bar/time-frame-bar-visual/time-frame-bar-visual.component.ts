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

import { Component, OnInit, inject } from "@angular/core";
import moment from "moment/moment";

import { HistoryStorage, ITimeframe, TimeframeService } from "@nova-ui/bits";

class TestBar {
    private _baseDate = moment([2018, 5, 1, 15, 0, 0]);
    public get baseDate() {
        return this._baseDate;
    }
    public timeFrame: ITimeframe = this.getDefaultTF();
    public history = new HistoryStorage<ITimeframe>();

    constructor(public id: string) {
        this.history.restart(this.timeFrame);
    }

    public zoomIn = (value: ITimeframe) =>
        (this.timeFrame = this.history.save(value));
    public undo = () => (this.timeFrame = this.history.undo());
    public change = (value?: ITimeframe) =>
        (this.timeFrame = this.history.restart(value));

    private getDefaultTF(): ITimeframe {
        return {
            startDatetime: this._baseDate.clone().subtract(1, "week"),
            endDatetime: this._baseDate.clone(),
        };
    }
}

@Component({
    selector: "nui-convenience-time-frame-bar-visual-test",
    templateUrl: "./time-frame-bar-visual.component.html",
    standalone: false,
})
export class TimeFrameBarVisualTestComponent implements OnInit {
    private timeframeService = inject(TimeframeService);

    public bars: TestBar[] = ["first", "second", "third"].map(
        (id) => new TestBar(id)
    );
    public barNoQuickPick = new TestBar("bar-no-quick-pick");

    public ngOnInit(): void {
        setTimeout(() => {
            // No zoom on bar[0]
            this.zoomBar(this.bars[1]);
            this.zoomBar(this.bars[2]);
            this.zoomBar(this.bars[2]);
        });
    }

    public zoomBar(bar: TestBar): void {
        bar.zoomIn(this.zoomTF(bar.timeFrame));
    }

    public zoomTF(timeFrame: ITimeframe): ITimeframe {
        return {
            startDatetime: timeFrame.startDatetime.clone().add(1, "day"),
            endDatetime: timeFrame.endDatetime.clone().subtract(1, "day"),
        };
    }

    public changeTimeFrame(value: ITimeframe, bar: TestBar): void {
        const tf = this.timeframeService.reconcileTimeframe(
            value,
            undefined,
            bar.baseDate
        );
        bar.change(tf);
    }
}
