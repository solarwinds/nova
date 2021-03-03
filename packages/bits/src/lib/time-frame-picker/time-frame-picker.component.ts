import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import _cloneDeep from "lodash/cloneDeep";
import { Moment } from "moment/moment";
import moment from "moment/moment";
import { Subject } from "rxjs";

import { ITimeframe, ITimeFramePreset } from "./public-api";
import { TimeframeService } from "./services/timeframe.service";

// <example-url>./../examples/index.html#/time-frame-picker</example-url>

@Component({
    selector: "nui-time-frame-picker",
    templateUrl: "./time-frame-picker.component.html",
    styleUrls: ["./time-frame-picker.component.less"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeFramePickerComponent implements OnChanges, OnInit, OnDestroy {

    /**  earliest selectable date */
    @Input() minDate: Moment;
    /**  latest selectable date */
    @Input() maxDate: Moment;
    /** model of timepicker */
    @Input() startModel: ITimeframe;
    /** Allows popup box to be attached to document.body */
    @Input() appendToBody: boolean;

    public model: ITimeframe;

    /** callback to be invoked on model change*/
    @Output() public changed = new EventEmitter<ITimeframe>();

    public isFocused: boolean;
    public modelDefault: any;

    public distanceToEndDate: number; // to keep distance between start and end-date

    public onDestroy$ = new Subject<void>();
    
    constructor(private timeFrameService: TimeframeService, public changeDetector: ChangeDetectorRef) {}

    ngOnChanges(changes: any): void {
        if (changes["startModel"]) {
            this.model = TimeframeService.cloneTimeFrame(this.startModel);
            this.validateCombination();
        }
    }

    ngOnInit() {
        if (this.startModel) {
            this.model = TimeframeService.cloneTimeFrame(this.startModel);
            this.validateCombination();
        }
    }

    public selectPreset(key: string, value: ITimeFramePreset) {
        const timeframe = this.timeFrameService.getTimeframe(value.startDatetimePattern, value.endDatetimePattern);
        timeframe.selectedPresetId = key;
        this.model = timeframe;
    }

    public isPresetSelected(key: string) {
        return this.model && this.model.selectedPresetId === key;
    }

    public onChangeInternalStart(event: any) {
        this.model.startDatetime = event;
        this.onChangeInternal();
    }

    public onChangeInternalEnd(event: any) {
        this.model.endDatetime = event;
        this.onChangeInternal();
    }

    public onBlurInternal() {
        this.validateCombination();

        if (!this.model.startDatetime || !this.model.endDatetime) {
            this.model = _cloneDeep(this.modelDefault);
        } else {
            this.modelDefault = _cloneDeep(this.model);
        }
        this.isFocused = false;
    }

    public onFocusInternal() {
        this.modelDefault = _cloneDeep(this.model);
        this.isFocused = true;
    }

    private validateCombination() {
        if (this.model.startDatetime && this.model.endDatetime) {
            if (this.model.startDatetime >= this.model.endDatetime) {
                this.model.endDatetime = moment(this.model.startDatetime.valueOf() + this.distanceToEndDate);
                this.model.selectedPresetId = undefined;
                this.model.title = undefined;
            } else {
                this.updateDistanceToEndDate(this.model.startDatetime, this.model.endDatetime);
            }
        }
    }

    private updateDistanceToEndDate(newStartDatetime: Date | Moment, newEndDatetime: Date | Moment) {
        const startMoment = moment(newStartDatetime);
        const endMoment = moment(newEndDatetime);

        if (startMoment.isValid() && endMoment.isValid()) {
            this.distanceToEndDate = newEndDatetime.valueOf() - newStartDatetime.valueOf();
        }
    }

    private onChangeInternal() {
        if (!this.isFocused) {
            this.validateCombination();
        }
        // clear 'selectedPresetId' and 'title' values
        if (this.model.selectedPresetId) {
            const timeFrame = this.timeFrameService.getTimeframeByPresetId(this.model.selectedPresetId);

            if (!this.model.startDatetime || !this.model.endDatetime ||
                !this.timeFrameService.isEqualDuration(this.model, timeFrame)) {
                this.model.selectedPresetId = undefined;
                this.model.title = undefined;
            }
        }
        this.changed.emit(this.model);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
