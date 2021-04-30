import {
    AfterContentInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import _each from "lodash/each";
import _isNil from "lodash/isNil";
import _uniqueId from "lodash/uniqueId";
import moment from "moment/moment";
import { Moment } from "moment/moment";
import { Subject } from "rxjs";

import { IDatePickerDisabledDate } from "./public-api";
/** @ignore */
@Component({
    selector: "nui-date-picker-inner",
    templateUrl: "./date-picker-inner.component.html",
})
export class DatePickerInnerComponent implements AfterContentInit, OnInit, OnChanges, OnDestroy {
    @Input() locale: string;
    @Input() datepickerMode: string;
    @Input() startingDay: number;
    @Input() yearRange: number;
    @Input() minDate: Moment;
    @Input() maxDate: Moment;
    @Input() minMode: string;
    @Input() maxMode: string;
    @Input() showWeeks: boolean;
    @Input() dateFormat: string;
    @Input() formatDay: string;
    @Input() formatMonth: string;
    @Input() formatYear: string;
    @Input() formatDayHeader: string;
    @Input() formatDayTitle: string;
    @Input() formatMonthTitle: string;
    @Input() onlyCurrentMonth: boolean;
    @Input() preserveInsignificant: boolean;
    @Input() disabledDates: IDatePickerDisabledDate[];
    @Input() initDate: Moment;
    @Input() inline: boolean;
    @Input() selectedDate: Moment;
    /** Is used to handle timezone of date value */
    @Input() handleTimezone: boolean;

    @Output()
    selectionDone: EventEmitter<Moment> = new EventEmitter<Moment>();

    @Output()
    update: EventEmitter<Moment> = new EventEmitter<Moment>();

    public stepDay: any = {};
    public stepMonth: any = {};
    public stepYear: any = {};

    public uniqueId: string;
    public isTodayButtonDisabled: boolean;

    public calendarMoved: Subject<Moment> = new Subject<Moment>();

    protected _value: Moment | undefined;
    protected _todayDate: Moment = moment();

    protected refreshViewHandlerDay: Function;
    protected compareHandlerDay: Function;
    protected refreshViewHandlerMonth: Function;
    protected compareHandlerMonth: Function;
    protected refreshViewHandlerYear: Function;
    protected compareHandlerYear: Function;

    private modes: string[] = ["day", "month", "year"];

    get role(): string { return this.inline ? "application" : "dialog"; }

    @Input()
    get value(): Moment | undefined {
        return this._value;
    }

    set value(value: Moment | undefined) {
        if (!this.preserveInsignificant && value) {
            value.set({"hour": 0, "minute": 0, "second": 0, "millisecond": 0});
        }

        this._value = value;
    }

    ngOnInit(): void {
        this.uniqueId = _uniqueId("date-picker--");

        if (this.initDate) {
            this.value = moment(this.initDate);
            this.selectionDone.emit(this.value);
            this.update.emit(this.value);
        } else if (_isNil(this.value)) {
            this.value = this._todayDate.clone();
        }
    }

    ngAfterContentInit(): void {
        this.refreshView();
        this.isTodayButtonDisabled = this.isDisabled(this._todayDate);
    }

    // this.refreshView should be called here to reflect the changes on the fly
    ngOnChanges(changes: SimpleChanges): void {
        if (this.shouldRefreshViewOnChanges(changes)) {
            this.refreshView();
        }
    }

    public shouldRefreshViewOnChanges(changes: SimpleChanges): boolean {
        let shouldRefreshView: boolean;

        switch (this.datepickerMode) {
            case "day":
                shouldRefreshView = !_isNil(changes.value) && !_isNil(this.selectedDate)
                    && !changes.value.currentValue.isSame(changes.value.previousValue);
                break;
            case "month":
                shouldRefreshView = !_isNil(this.value) && !_isNil(this.selectedDate) && this.value.month() !== this.selectedDate.month();
                break;
            case "year":
                shouldRefreshView = !_isNil(this.value) && !_isNil(this.selectedDate) && this.value.year() !== this.selectedDate.year();
                break;
            default:
                shouldRefreshView = false;
        }

        if (shouldRefreshView) {
            _each(changes, (change) => {
                shouldRefreshView = (!change.firstChange && moment.isMoment(change.currentValue) && !change.currentValue.isSame(change.previousValue));
            });
        }

        return shouldRefreshView;
    }

    public setCompareHandler(handler: Function, type: string): void {
        if (type === "day") {
            this.compareHandlerDay = handler;
        }

        if (type === "month") {
            this.compareHandlerMonth = handler;
        }

        if (type === "year") {
            this.compareHandlerYear = handler;
        }
    }

    public compare(date1: Moment, date2?: Moment): number | undefined {
        if (_isNil(date1) || _isNil(date2)) {
            return undefined;
        }

        if (this.datepickerMode === "day" && this.compareHandlerDay) {
            return this.compareHandlerDay(date1, date2);
        }

        if (this.datepickerMode === "month" && this.compareHandlerMonth) {
            return this.compareHandlerMonth(date1, date2);
        }

        if (this.datepickerMode === "year" && this.compareHandlerYear) {
            return this.compareHandlerYear(date1, date2);
        }

        return void 0;
    }

    public setRefreshViewHandler(handler: Function, type: string): void {
        if (type === "day") {
            this.refreshViewHandlerDay = handler;
        }

        if (type === "month") {
            this.refreshViewHandlerMonth = handler;
        }

        if (type === "year") {
            this.refreshViewHandlerYear = handler;
        }
    }

    public refreshView(): void {
        if (this.datepickerMode === "day" && this.refreshViewHandlerDay) {
            this.refreshViewHandlerDay();
        }

        if (this.datepickerMode === "month" && this.refreshViewHandlerMonth) {
            this.refreshViewHandlerMonth();
        }

        if (this.datepickerMode === "year" && this.refreshViewHandlerYear) {
            this.refreshViewHandlerYear();
        }
    }

    public createDateObject(date: Moment, format: string): any {
        return {
            date: date.clone().toISOString(this.handleTimezone),
            label: this.formatDate(date, format),
            selected: this.compare(date, this.selectedDate) === 0,
            disabled: this.isDisabled(date),
            current: this.compare(date, this.value) === 0,
            today: this.compare(date, this._todayDate) === 0,
        };
    }

    public split(arr: any[], size: number): any[] {
        const arrays: any[] = [];

        while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
        }

        return arrays;
    }

    public select(date: string, event: any): void {
        this.value = this.handleTimezone
            ? moment.parseZone(date)
            : moment(date);

        if (this.datepickerMode === this.minMode) {
            this.selectionDone.emit(this.value);
        } else {
            this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) - 1];
            event.stopPropagation();
        }

        this.update.emit(this.value);
        this.refreshView();
    }

    public move(direction: number, event: any): void {
        let expectedStep: any;

        if (this.datepickerMode === "day") {
            expectedStep = this.stepDay;
        }

        if (this.datepickerMode === "month") {
            expectedStep = this.stepMonth;
        }

        if (this.datepickerMode === "year") {
            expectedStep = this.stepYear;
        }

        if (expectedStep) {
            const activeDateMoment = this.value || moment();

            const year = activeDateMoment.year() + direction * (expectedStep.years || 0);
            const month = activeDateMoment.month() + direction * (expectedStep.months || 0);

            this.value = activeDateMoment.clone().set({"year": year, "month": month, "date": 1});
            this.refreshView();

            this.calendarMoved.next(this.value);
        }

        event.stopPropagation();
    }

    public toggleMode(event: any, _direction?: number): void {
        const direction = _direction || 1;

        if (
            (this.datepickerMode === this.maxMode && direction === 1) ||
            (this.datepickerMode === this.minMode && direction === -1)
        ) {
            return;
        }

        this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) + direction];
        this.refreshView();
        event.stopPropagation();
    }

    public isDisabled(date: Moment): boolean {
        let isDateDisabled = false;

        if (this.disabledDates) {
            this.disabledDates.forEach(
                (disabledDate: { date: Moment, mode: string }) => {
                    if (this.compareDateDisabled(disabledDate, date) === 0) {
                        isDateDisabled = true;
                    }
                }
            );
        }

        if (isDateDisabled) {
            return isDateDisabled;
        }

        const diff1: number | undefined = this.compare(date, this.minDate);
        const diff2: number | undefined = this.compare(date, this.maxDate);

        return (this.minDate && (diff1 || 0) < 0) || (this.maxDate && (diff2 || 0) > 0);
    }

    public formatDate(date: any, format: any): string {
        return moment(date).clone().format(format);
    }

    protected compareDateDisabled(date1Disabled: { date: Moment, mode: string }, date2: Moment): number | undefined {
        if (_isNil(date1Disabled) || _isNil(date2)) {
            return undefined;
        }

        if (date1Disabled.mode === "day" && this.compareHandlerDay) {
            return this.compareHandlerDay(date1Disabled.date, date2);
        }

        if (date1Disabled.mode === "month" && this.compareHandlerMonth) {
            return this.compareHandlerMonth(date1Disabled.date, date2);
        }

        if (date1Disabled.mode === "year" && this.compareHandlerYear) {
            return this.compareHandlerYear(date1Disabled.date, date2);
        }

        return undefined;
    }

    ngOnDestroy() {
        this.calendarMoved.complete();
    }
}
