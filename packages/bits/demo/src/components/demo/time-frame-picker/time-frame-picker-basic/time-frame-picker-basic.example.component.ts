import { Component } from "@angular/core";
import { Subject } from "rxjs";

import {
    ITimeframe,
    ITimeFramePresetDictionary,
    TimeframeService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-time-frame-picker-basic-example",
    templateUrl: "./time-frame-picker-basic.example.component.html",
})
export class TimeFramePickerBasicExampleComponent {
    public presets: ITimeFramePresetDictionary;
    public selectedPresetKey?: string = "lastHour";
    public acceptedTimeframe: ITimeframe;
    public tf: ITimeframe;

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
