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
import { Subject } from "rxjs";

import {
    ITimeframe,
    ITimeFramePresetDictionary,
    TimeframeService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-time-frame-picker-basic-example",
    templateUrl: "./time-frame-picker-basic.example.component.html",
    standalone: false,
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

    public closePopoverSubject = new Subject<void>();
    public openPopoverSubject = new Subject<void>();

    public updateTf(value: ITimeframe): void {
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
        this.selectedPresetKey = presetKey;
        this.tf = this.timeframeService.getTimeframeByPresetId(presetKey);
        this.acceptedTimeframe = this.tf;
        this.closePopoverSubject.next();
    }
}
