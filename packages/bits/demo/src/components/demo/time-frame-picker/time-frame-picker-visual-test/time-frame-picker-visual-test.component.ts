import { Component } from "@angular/core";
import {
    IQuickPickPresetDictionary, ITimeframe, ITimeFramePresetDictionary, TimeframeService,
} from "@nova-ui/bits";
import _find from "lodash/find";
import _isUndefined from "lodash/isUndefined";
import moment, { Moment } from "moment/moment";
import { Subject } from "rxjs";

@Component({
    selector: "nui-time-frame-picker-visual-test",
    templateUrl: "./time-frame-picker-visual-test.component.html",
})

export class TimeFramePickerVisualTestComponent {
    public presets: ITimeFramePresetDictionary;
    public presetsDatePicker: IQuickPickPresetDictionary;
    public selectedPresetKey?: string = "lastHour";
    public selectedPresetKeyDatePicker = "dimasBirthday";
    public acceptedTimeframe: ITimeframe;
    public tf: ITimeframe;
    public selectedDate: Moment;

    public showFooter: boolean = false;

    constructor(public timeframeService: TimeframeService) {
        this.presets = timeframeService.getDefaultPresets();
        this.acceptedTimeframe = this.timeframeService.getTimeframeByPresetId(this.selectedPresetKey, "02/17/1986");
        this.tf = this.acceptedTimeframe;
        this.presetsDatePicker = this.getDefaultPresets();
        this.selectedDate = this.getDateFromPreset(this.selectedPresetKeyDatePicker);
    }

    public closePopoverSubject = new Subject();
    public openPopoverSubject = new Subject();

    public updateTf(value: ITimeframe): void {
        this.tf = value;
        const timeFrameDatesValid = () => this.timeframeService.areTimeFrameDatesValid(value);
        const timeFrameDatesEqual = () => this.timeframeService.isEqual(this.tf, this.acceptedTimeframe);
        if (timeFrameDatesValid() && !timeFrameDatesEqual()) { this.showFooter = true; }
        this.selectedPresetKey = this.tf.selectedPresetId;
    }

    public confirmPopover(): void {
        this.showFooter = false;
        this.closePopoverSubject.next();
        this.acceptedTimeframe = this.tf;
    }
    public cancelPopover(): void {
        this.showFooter = false;
        this.closePopoverSubject.next();
    }

    public handlePresetSelection(presetKey: string): void {
        this.selectedPresetKeyDatePicker = presetKey;
        this.tf = this.timeframeService.getTimeframeByPresetId(presetKey, "02/17/1986");
        this.acceptedTimeframe = this.tf;
        this.closePopoverSubject.next();
    }

    public confirmPopoverDatePicker(): void {
        this.closePopoverSubject.next();
    }

    public handlePresetSelectionDatePicker(presetKey: string): void {
        this.selectedDate = this.getDateFromPreset(presetKey);
        this.selectedPresetKeyDatePicker = presetKey;
        this.confirmPopoverDatePicker();
    }

    public dateChanged(value: Moment): void {
        if (!this.selectedDate.isSame(value, "day")) {
            this.selectedDate = value;
            this.selectedPresetKeyDatePicker = this.getPresetFromDate(value); // will return undefined if not found, exactly what's needed
            this.confirmPopoverDatePicker();
        }
    }

    private getDefaultPresets(): { [key: string]: any } {
        return {
            today: { name: "Today", pattern: () => moment() },
            yesterday: { name: "Yesterday", pattern: () => moment().subtract(1, "days") },
            dimasBirthday: { name: "Dima's Birthday", pattern: () => moment("1986-02-17") },
            random: {
                name: "Random date (to show that we can)",
                pattern: () => moment(+(new Date()) - Math.floor(Math.random() * 100000000000)),
            },
        };
    }

    private getDateFromPreset(presetKey: string): Moment {
        const preset = this.getDefaultPresets()[presetKey];
        return preset ? preset.pattern() : moment();
    }

    private getPresetFromDate(date: Moment): string {
        const preset: string | undefined = _find(Object.keys(this.presets), (key) => date.isSame(this.getDateFromPreset(key), "day"));
        if (_isUndefined(preset)) {
            throw new Error("DatePreset was not found");
        }
        return preset;
    }
}
