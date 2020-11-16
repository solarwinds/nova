import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges
} from "@angular/core";
import moment, { Moment } from "moment/moment";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { LoggerService } from "../../../services/log-service";
import { ITimeframe } from "../../time-frame-picker/public-api";
import { QuickPickerComponent } from "../../time-frame-picker/quick-picker/quick-picker.component";
import { TimeframeService } from "../../time-frame-picker/services/timeframe.service";
import { TimeFramePickerComponent } from "../../time-frame-picker/time-frame-picker.component";

/**
 *
 * <div class="card card-inverse card-warning mb-3">
 *   <h4 class="card-header">This is a Convenience Component!</h4>
 *   <div class="card-block">
 *     <p class="card-text">
 *       Please check the section under the <strong>Additional Documentation</strong> sub-menu for more details and usage examples.
 *     </p>
 *   </div>
 *   <div class="card-footer">
 *     <a href="../additional-documentation/convenience-components.html" class="card-link">Read more...</a>
 *   </div>
 * </div>
 *
 */
@Component({
    selector: "nui-time-frame-bar",
    templateUrl: "./time-frame-bar.component.html",
    styleUrls: ["./time-frame-bar.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeFrameBarComponent implements AfterContentInit, OnChanges, OnDestroy {
    /** Earliest selectable date */
    @Input() minDate: Moment;
    /** Latest selectable date */
    @Input() maxDate: Moment;

    /** Current time frame value */
    @Input() timeFrame: ITimeframe = {
        startDatetime: this.minDate,
        endDatetime: this.maxDate,
    };
    @Output() timeFrameChange = new EventEmitter<ITimeframe>();

    /** Current index in zoom history */
    @Input() historyIndex = 0;

    /** Emits an event when "Zoom Out" is clicked */
    @Output() undo = new EventEmitter();
    /** Emits an event when "Clear" is clicked */
    @Output() clear = new EventEmitter();

    @ContentChild(TimeFramePickerComponent) timeFramePicker: TimeFramePickerComponent;
    @ContentChild(QuickPickerComponent) quickPicker: QuickPickerComponent;

    public presets = this.timeframeService.getDefaultPresets();
    public pickerTimeframe: ITimeframe;
    public closePopoverSubject = new Subject();
    public changed: boolean = false;
    public isLeftmostRange = false;
    public isRightmostRange = false;
    public humanizedTimeframe: string;
    public readonly defaultPickerTitle = $localize `:Label indicating that the user can select a custom start date and/or end date:Custom Range`;

    private destroy$ = new Subject();

    constructor(
        public timeframeService: TimeframeService,
        private logger: LoggerService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngAfterContentInit() {
        if (!this.timeFramePicker) {
            throw new Error("TimeFramePickerComponent must be present in 'timeFrameSelection' slot");
        }

        if (this.timeFramePicker.minDate || this.timeFramePicker.maxDate || this.timeFramePicker.startModel) {
            this.logger.warn(`minDate, maxDate, and startModel inputs set on the TimeFramePickerComponent will be ignored. Use the minDate,
maxDate, and timeFrame inputs on the TimeFrameBarComponent instead.`);
        }

        this.timeFramePicker.model = this.pickerTimeframe;
        this.timeFramePicker.minDate = this.minDate;
        this.timeFramePicker.maxDate = this.maxDate;
        this.timeFramePicker.changed.pipe(takeUntil(this.destroy$)).subscribe((tf: ITimeframe) => this.updatePickerTf(tf));

        if (this.quickPicker) {
            this.quickPicker.presets = this.quickPicker.presets || this.timeframeService.getDefaultPresets();
            this.quickPicker.pickerTitle = undefined === this.quickPicker.pickerTitle ? this.defaultPickerTitle : this.quickPicker.pickerTitle;
            this.quickPicker.presetSelected.pipe(takeUntil(this.destroy$)).subscribe((presetKey: string) => this.handlePresetSelection(presetKey));
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["timeFrame"]) {
            const value = changes["timeFrame"].currentValue;
            this.isLeftmostRange = this.minDate && this.minDate.diff(value.startDatetime) >= 0;
            this.isRightmostRange = this.maxDate && this.maxDate.diff(value.endDatetime) <= 0;
            this.pickerTimeframe = TimeframeService.cloneTimeFrame(value);
            this.humanizedTimeframe = this.timeframeService.getDuration(this.timeFrame).humanize();
        }
    }

    public onPopoverShown() {
        this.timeFramePicker.model = this.pickerTimeframe;
        this.timeFramePicker.changeDetector.markForCheck();

        if (this.quickPicker) {
            this.quickPicker.selectedPreset = this.timeFrame.selectedPresetId;
            this.quickPicker.changeDetector.markForCheck();
        }
    }

    public onUndo() {
        this.undo.emit();
    }

    public onClear() {
        this.clear.emit();
    }

    public updatePickerTf(value: ITimeframe) {
        this.pickerTimeframe = value;
        this.changed = !this.timeframeService.isEqual(this.pickerTimeframe, this.timeFrame);
        this.changeDetectorRef.markForCheck();
    }

    public handlePresetSelection(presetKey: string) {
        this.pickerTimeframe = this.timeframeService.getTimeframeByPresetId(presetKey);

        this.quickPicker.selectedPreset = presetKey;
        this.quickPicker.changeDetector.markForCheck();

        this.closePopover(true);
    }

    public closePopover(confirmed = false) {
        if (confirmed) {
            this.changeTimeFrame(TimeframeService.cloneTimeFrame(this.pickerTimeframe));
        }
        this.closePopoverSubject.next();
        this.changed = false;
    }

    public shiftRange(factor: number) {
        const tf = this.timeFrame;
        const shiftDuration = moment.duration(factor * tf.endDatetime.diff(tf.startDatetime));
        this.changeTimeFrame(this.timeframeService.shiftTimeFrame(tf, shiftDuration));
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
    }

    private changeTimeFrame(value: ITimeframe) {
        this.timeFrameChange.emit(value);
    }
}
