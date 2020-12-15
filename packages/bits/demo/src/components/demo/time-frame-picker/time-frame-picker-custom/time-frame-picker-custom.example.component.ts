import { Component } from "@angular/core";
import { ITimeframe, ITimeFramePresetDictionary, TimeframeService } from "@nova-ui/bits";
import { Subject } from "rxjs";

@Component({
    selector: "nui-time-frame-picker-custom",
    templateUrl: "./time-frame-picker-custom.example.component.html",
    providers: [TimeframeService],
})

export class TimeFramePickerCustomExampleComponent {
    public presets: ITimeFramePresetDictionary = {
        "last42Hours": {
            name: $localize `Last 42 hours`,
            startDatetimePattern: {hours: -42},
            endDatetimePattern: {},
        },
        "last749Days": {
            name: $localize `Last 749 days`,
            startDatetimePattern: {days: -749},
            endDatetimePattern: {},
        },
    };
    public selectedPresetKey?: string = "last42Hours";
    public acceptedTimeframe: ITimeframe;
    public tf: ITimeframe;

    public showFooter: boolean = false;

    constructor(public timeframeService: TimeframeService) {
        this.timeframeService.currentPresets = this.presets;
        this.acceptedTimeframe = this.timeframeService.getTimeframeByPresetId(this.selectedPresetKey);
        this.tf = this.acceptedTimeframe;
    }

    public closePopoverSubject = new Subject();
    public openPopoverSubject = new Subject();

    public updateTf(value: ITimeframe) {
        this.tf = value;
        const timeFrameDatesValid = () => this.timeframeService.areTimeFrameDatesValid(value);
        const timeFrameDatesEqual = () => this.timeframeService.isEqual(this.tf, this.acceptedTimeframe);
        if (timeFrameDatesValid() && !timeFrameDatesEqual()) { this.showFooter = true; }

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
