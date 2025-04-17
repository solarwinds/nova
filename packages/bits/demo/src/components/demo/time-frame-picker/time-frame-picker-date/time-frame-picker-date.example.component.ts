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

import { Component } from "@angular/core";
import _find from "lodash/find";
import _isUndefined from "lodash/isUndefined";
import moment, { Moment } from "moment/moment";
import { Subject } from "rxjs";

import { IQuickPickPresetDictionary } from "@nova-ui/bits";

@Component({
    selector: "nui-time-frame-picker-date",
    templateUrl: "./time-frame-picker-date.example.component.html",
    standalone: false
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

    public closePopoverSubject = new Subject<void>();

    public handlePresetSelection(presetKey: string): void {
        this.selectedDate = this.getDateFromPreset(presetKey);
        this.selectedPresetKey = presetKey;
        this.confirmPopover();
    }

    public dateChanged(value: Moment): void {
        if (!this.selectedDate.isSame(value, "day")) {
            this.selectedDate = value;
            this.selectedPresetKey = this.getPresetFromDate(value); // will return undefined if not found, exactly what's needed
            this.confirmPopover();
        }
    }

    public confirmPopover(): void {
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
