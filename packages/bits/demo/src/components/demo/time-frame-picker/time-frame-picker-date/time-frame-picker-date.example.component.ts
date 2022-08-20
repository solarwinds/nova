import { Component } from "@angular/core";
import { IQuickPickPresetDictionary } from "@nova-ui/bits";
import _find from "lodash/find";
import _isUndefined from "lodash/isUndefined";
import moment, { Moment } from "moment/moment";
import { Subject } from "rxjs";

@Component({
    selector: "nui-time-frame-picker-date",
    templateUrl: "./time-frame-picker-date.example.component.html",
})
export class TimeFramePickerDateExampleComponent {
    public presets: IQuickPickPresetDictionary;
    public selectedPresetKey = "ihorsBirthday";
    public selectedDate: Moment;

    public showFooter: boolean = true;

    constructor() {
        this.presets = this.getDefaultPresets();
        this.selectedDate = this.getDateFromPreset(this.selectedPresetKey);
    }

    public closePopoverSubject = new Subject();

    public handlePresetSelection(presetKey: string) {
        this.selectedDate = this.getDateFromPreset(presetKey);
        this.selectedPresetKey = presetKey;
        this.confirmPopover();
    }

    public dateChanged(value: Moment) {
        if (!this.selectedDate.isSame(value, "day")) {
            this.selectedDate = value;
            this.selectedPresetKey = this.getPresetFromDate(value); // will return undefined if not found, exactly what's needed
            this.confirmPopover();
        }
    }

    public confirmPopover() {
        this.closePopoverSubject.next();
    }

    // These private methods are specific and will be in any case abstracted to a service by end users:

    private getDefaultPresets(): { [key: string]: any } {
        return {
            today: { name: "Today", pattern: () => moment() },
            yesterday: {
                name: "Yesterday",
                pattern: () => moment().subtract(1, "days"),
            },
            ihorsBirthday: {
                name: "Ihor's Birthday",
                pattern: () => moment("1989-04-09"),
            },
            random: {
                name: "Random date (to show that we can)",
                pattern: () =>
                    moment(
                        +new Date() - Math.floor(Math.random() * 100000000000)
                    ),
            },
        };
    }

    private getDateFromPreset(presetKey: string): Moment {
        const preset = this.getDefaultPresets()[presetKey];
        return preset ? preset.pattern() : moment();
    }

    private getPresetFromDate(date: Moment): string {
        const preset: string | undefined = _find(
            Object.keys(this.presets),
            (key) => date.isSame(this.getDateFromPreset(key), "day")
        );
        if (_isUndefined(preset)) {
            throw new Error("DatePreset was not found");
        }
        return preset;
    }
}
