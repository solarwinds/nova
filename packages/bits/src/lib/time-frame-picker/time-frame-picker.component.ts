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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation, inject } from "@angular/core";
import _cloneDeep from "lodash/cloneDeep";
import { Moment } from "moment/moment";
import moment from "moment/moment";

import { ITimeframe, ITimeFramePreset } from "./public-api";
import { TimeframeService } from "./services/timeframe.service";

// <example-url>./../examples/index.html#/time-frame-picker</example-url>

@Component({
    selector: "nui-time-frame-picker",
    templateUrl: "./time-frame-picker.component.html",
    styleUrls: ["./time-frame-picker.component.less"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class TimeFramePickerComponent implements OnChanges, OnInit {
    private timeFrameService = inject(TimeframeService);
    changeDetector = inject(ChangeDetectorRef);

    /**  earliest selectable date */
    @Input() minDate: Moment;
    /**  latest selectable date */
    @Input() maxDate: Moment;
    /** model of timepicker */
    @Input() startModel: ITimeframe;
    /** Allows popup box to be attached to document.body */
    @Input() appendToBody: boolean;

    public model: ITimeframe;

    /** callback to be invoked on model change */
    @Output() public changed = new EventEmitter<ITimeframe>();

    public isFocused: boolean;
    public modelDefault: any;

    public distanceToEndDate: number;

    public ngOnChanges(changes: any): void {
        if (changes["startModel"]) {
            this.model = TimeframeService.cloneTimeFrame(this.startModel);
            this.validateCombination();
        }
    }

    public ngOnInit(): void {
        if (this.startModel) {
            this.model = TimeframeService.cloneTimeFrame(this.startModel);
            this.validateCombination();
        }
    }

    public selectPreset(key: string, value: ITimeFramePreset): void {
        const timeframe = this.timeFrameService.getTimeframe(
            value.startDatetimePattern,
            value.endDatetimePattern
        );
        timeframe.selectedPresetId = key;
        this.model = timeframe;
    }

    public isPresetSelected(key: string): boolean {
        return this.model && this.model.selectedPresetId === key;
    }

    public onChangeInternalStart(event: any): void {
        this.model.startDatetime = event;
        this.onChangeInternal();
    }

    public onChangeInternalEnd(event: any): void {
        this.model.endDatetime = event;
        this.onChangeInternal();
    }

    public onBlurInternal(): void {
        this.validateCombination();

        if (!this.model.startDatetime || !this.model.endDatetime) {
            this.model = _cloneDeep(this.modelDefault);
        } else {
            this.modelDefault = _cloneDeep(this.model);
        }
        this.isFocused = false;
    }

    public onFocusInternal(): void {
        this.modelDefault = _cloneDeep(this.model);
        this.isFocused = true;
    }

    private validateCombination() {
        if (this.model.startDatetime && this.model.endDatetime) {
            if (this.model.startDatetime >= this.model.endDatetime) {
                this.model.endDatetime = moment(
                    this.model.startDatetime.valueOf() + this.distanceToEndDate
                );
                this.model.selectedPresetId = undefined;
                this.model.title = undefined;
            } else {
                this.updateDistanceToEndDate(
                    this.model.startDatetime,
                    this.model.endDatetime
                );
            }
        }
    }

    private updateDistanceToEndDate(
        newStartDatetime: Date | Moment,
        newEndDatetime: Date | Moment
    ) {
        const startMoment = moment(newStartDatetime);
        const endMoment = moment(newEndDatetime);

        if (startMoment.isValid() && endMoment.isValid()) {
            this.distanceToEndDate =
                newEndDatetime.valueOf() - newStartDatetime.valueOf();
        }
    }

    private onChangeInternal() {
        if (!this.isFocused) {
            this.validateCombination();
        }
        // clear 'selectedPresetId' and 'title' values
        if (this.model.selectedPresetId) {
            const timeFrame = this.timeFrameService.getTimeframeByPresetId(
                this.model.selectedPresetId
            );

            if (
                !this.model.startDatetime ||
                !this.model.endDatetime ||
                !this.timeFrameService.isEqualDuration(this.model, timeFrame)
            ) {
                this.model.selectedPresetId = undefined;
                this.model.title = undefined;
            }
        }
        this.changed.emit(this.model);
    }
}
