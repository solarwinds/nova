import { Component, OnInit } from "@angular/core";
import { HistoryStorage, ITimeframe, TimeframeService } from "@nova-ui/bits";
import moment from "moment/moment";

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
})
export class TimeFrameBarVisualTestComponent implements OnInit {
    public bars: TestBar[] = ["first", "second", "third"].map(
        (id) => new TestBar(id)
    );
    public barNoQuickPick = new TestBar("bar-no-quick-pick");

    constructor(private timeframeService: TimeframeService) {}

    ngOnInit(): void {
        setTimeout(() => {
            // No zoom on bar[0]
            this.zoomBar(this.bars[1]);
            this.zoomBar(this.bars[2]);
            this.zoomBar(this.bars[2]);
        });
    }

    public zoomBar(bar: TestBar) {
        bar.zoomIn(this.zoomTF(bar.timeFrame));
    }

    public zoomTF(timeFrame: ITimeframe): ITimeframe {
        return {
            startDatetime: timeFrame.startDatetime.clone().add(1, "day"),
            endDatetime: timeFrame.endDatetime.clone().subtract(1, "day"),
        };
    }

    public changeTimeFrame(value: ITimeframe, bar: TestBar) {
        const tf = this.timeframeService.reconcileTimeframe(
            value,
            undefined,
            bar.baseDate
        );
        bar.change(tf);
    }
}
