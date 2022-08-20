import { Component } from "@angular/core";
import {
    ITimeframe,
    ITimeFramePresetDictionary,
    TimeframeService,
} from "@nova-ui/bits";
import moment from "moment/moment";
import { Subject } from "rxjs";

@Component({
    selector: "nui-time-frame-picker-test",
    templateUrl: "./time-frame-picker-test.example.component.html",
})
export class TimeFramePickerTestExampleComponent {
    public presets: ITimeFramePresetDictionary;
    public selectedPresetKey?: string = "lastHour";
    public acceptedTimeframe: ITimeframe;
    public tf: ITimeframe;

    public minDate = moment("04/07/2018", "L"); // "L" is "MM/DD/YYY" in moment.js
    public maxDate = moment();

    public showFooter: boolean = false;

    constructor(public timeframeService: TimeframeService) {
        this.presets = timeframeService.getDefaultPresets();
        this.acceptedTimeframe = this.timeframeService.getTimeframeByPresetId(
            this.selectedPresetKey
        );
        this.tf = this.acceptedTimeframe;
    }

    public closePopoverSubject = new Subject();
    public openPopoverSubject = new Subject();

    public updateTf(value: ITimeframe) {
        this.tf = value;
        const timeFrameDatesValid = () =>
            this.timeframeService.areTimeFrameDatesValid(value);
        const timeFrameDatesEqual = () =>
            this.timeframeService.isEqual(this.tf, this.acceptedTimeframe);
        if (timeFrameDatesValid() && !timeFrameDatesEqual()) {
            this.showFooter = true;
        }

        this.selectedPresetKey = this.tf.selectedPresetId;
    }

    public confirmPopover() {
        this.showFooter = false;
        this.closePopoverSubject.next();
        this.acceptedTimeframe = this.tf;
    }
    public cancelPopover() {
        this.showFooter = false;
        this.closePopoverSubject.next();
    }

    public handlePresetSelection(presetKey: string) {
        this.selectedPresetKey = presetKey;
        this.tf = this.timeframeService.getTimeframeByPresetId(presetKey);
        this.acceptedTimeframe = this.tf;
        this.closePopoverSubject.next();
    }
}
