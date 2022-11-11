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

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChildren,
} from "@angular/core";
import { Subject } from "rxjs";

import {
    ITimeframe,
    ITimeFramePresetDictionary,
    TimeframeService,
} from "@nova-ui/bits";

interface IPicker {
    id: string;
    presets: ITimeFramePresetDictionary;
    timeframeService?: TimeframeService;
    tf?: ITimeframe;
    acceptedTimeframe?: ITimeframe;
    selectedPresetKey: string;
}

@Component({
    selector: "nui-time-frame-picker-multiple-custom-pickers",
    templateUrl:
        "./time-frame-picker-multiple-custom-pickers.example.component.html",
})
export class TimeFramePickerMultipleCustomPickersExampleComponent
    implements AfterViewInit
{
    @ViewChildren("scoper")
    private tfScopers: QueryList<TimeframeServiceScoperExampleComponent>;

    public pickers: IPicker[] = [
        {
            id: "1",
            presets: {
                last42Hours: {
                    name: $localize`Last 42 hours`,
                    startDatetimePattern: { hours: -42 },
                    endDatetimePattern: {},
                },
                last749Days: {
                    name: $localize`Last 749 days`,
                    startDatetimePattern: { days: -749 },
                    endDatetimePattern: {},
                },
            },
            selectedPresetKey: "last749Days",
        },
        {
            id: "2",
            presets: {
                last42Hours: {
                    name: $localize`Last 42 hours`,
                    startDatetimePattern: { hours: -42 },
                    endDatetimePattern: {},
                },
            },
            selectedPresetKey: "last42Hours",
        },
        {
            id: "3",
            presets: {
                lastYear: {
                    name: $localize`Last year`,
                    startDatetimePattern: { year: -1 },
                    endDatetimePattern: {},
                },
                last10Years: {
                    name: $localize`Last 10 years`,
                    startDatetimePattern: { year: -10 },
                    endDatetimePattern: {},
                },
            },
            selectedPresetKey: "lastYear",
        },
    ];

    public presets: ITimeFramePresetDictionary = {
        last42Hours: {
            name: $localize`Last 42 hours`,
            startDatetimePattern: { hours: -42 },
            endDatetimePattern: {},
        },
        last749Days: {
            name: $localize`Last 749 days`,
            startDatetimePattern: { days: -749 },
            endDatetimePattern: {},
        },
    };

    public showFooter: boolean = false;

    public closePopoverSubject = new Subject<void>();
    public openPopoverSubject = new Subject<void>();

    constructor(private cdRef: ChangeDetectorRef) {}

    public updateTf(value: ITimeframe, index: number) {
        const picker = this.pickers[index];
        picker.tf = value;

        const timeFrameDatesValid = () =>
            picker.timeframeService?.areTimeFrameDatesValid(value);
        const timeFrameDatesEqual = () =>
            picker.timeframeService?.isEqual(
                <ITimeframe>picker.tf,
                <ITimeframe>picker.acceptedTimeframe
            );
        if (timeFrameDatesValid() && !timeFrameDatesEqual()) {
            this.showFooter = true;
        }

        picker.selectedPresetKey = <string>picker.tf.selectedPresetId;
    }

    public ngAfterViewInit() {
        this.tfScopers.forEach((scoper, i) => {
            const picker = this.pickers[i];
            const timeframeService = scoper.timeframeService;

            picker.timeframeService = timeframeService;
            timeframeService.currentPresets = picker.presets;
            picker.acceptedTimeframe = timeframeService.getTimeframeByPresetId(
                picker.selectedPresetKey
            );
            picker.tf = picker.acceptedTimeframe;
        });
        this.cdRef.detectChanges();
    }

    public confirmPopover(index: number) {
        const picker = this.pickers[index];

        this.showFooter = false;
        this.closePopoverSubject.next();
        picker.acceptedTimeframe = picker.tf;
    }
    public cancelPopover(index: number) {
        this.showFooter = false;
        this.closePopoverSubject.next();
    }

    public handlePresetSelection(presetKey: string, index: number) {
        const picker = this.pickers[index];

        picker.selectedPresetKey = presetKey;
        picker.tf = picker.timeframeService?.getTimeframeByPresetId(presetKey);
        picker.acceptedTimeframe = picker.tf;
        this.closePopoverSubject.next();
    }
}

@Component({
    selector: "nui-time-frame-service-scoper",
    providers: [TimeframeService],
    template: `<ng-content></ng-content>`,
})
export class TimeframeServiceScoperExampleComponent {
    constructor(public timeframeService: TimeframeService) {}
}
