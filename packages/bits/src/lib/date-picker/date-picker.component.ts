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

import { OverlayConfig } from "@angular/cdk/overlay";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
} from "@angular/forms";
import _defaults from "lodash/defaults";
import _isEqual from "lodash/isEqual";
import _isNil from "lodash/isNil";
import _isNull from "lodash/isNull";
import moment, { Moment } from "moment/moment";
import { Subject, Subscription } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

import { NuiValidators } from "../../validators";
import { NuiFormFieldControl } from "../form-field/public-api";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "../overlay/constants";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { TextboxComponent } from "../textbox/textbox.component";
import { DatePickerInnerComponent } from "./date-picker-inner.component";
import {
    datePickerDateFormats,
    datePickerDefaults,
    IDatePickerDisabledDate,
} from "./public-api";

// <example-url>./../examples/index.html#/date-picker</example-url><br />
@Component({
    selector: "nui-date-picker",
    templateUrl: "./date-picker.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
    ],
    styleUrls: ["./date-picker.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class DatePickerComponent
    implements
        OnChanges,
        OnInit,
        ControlValueAccessor,
        NuiFormFieldControl,
        AfterViewInit,
        OnDestroy
{
    /** sets date-picker inline mode */
    @HostBinding("class.nui-datepicker--inline")
    @Input()
    inline: boolean;
    /** checks if value in datepicker is required */
    @Input() isRequired: boolean;
    /** Option to disabled datepicker. */
    @Input() isDisabled: boolean;
    /** to apply error state styles */
    @Input() isInErrorState: boolean;
    /** Input to set aria label text */
    @Input() public ariaLabel: string = "Date Picker";

    // TODO: Consider injecting locale through LOCALE_ID Injection Token
    /** to date format locale */
    @Input() locale: string;
    /** sets date-picker mode, supports: `day`, `month`, `year` */
    @Input() datepickerMode = "day";
    /**  earliest selectable date */
    @Input() minDate: Moment;
    /** latest selectable date */
    @Input() maxDate: Moment;
    /** set lower date-picker mode, supports: `day`, `month`, `year` */
    @Input() minMode: string;
    /** sets upper date-picker mode, supports: `day`, `month`, `year` */
    @Input() maxMode: string;
    /** if false week numbers will be hidden */
    @Input() showWeeks = false;
    /** date format, used to format selected date */
    @Input() dateFormat: string;
    /** format of day in month */
    @Input() formatDay: string;
    /** format of month in year */
    @Input() formatMonth: string;
    /** format of year in year range */
    @Input() formatYear: string;
    /** format of day in week header */
    @Input() formatDayHeader: string;
    /** format of title when selecting day */
    @Input() formatDayTitle: string;
    /** format of title when selecting month */
    @Input() formatMonthTitle: string;
    /** starting day of the week from 0-6 (0=Sunday, ..., 6=Saturday) */
    @Input() startingDay: number;
    /** number of years displayed in year selection */
    @Input() yearRange: number;
    /** if true only dates from the currently displayed month will be shown */
    @Input() onlyCurrentMonth: boolean;
    /** number of months displayed in a single row of month picker */
    @Input() preserveInsignificant = false;
    /** array of custom css classes to be applied to targeted dates */
    @Input() disabledDates: IDatePickerDisabledDate[];
    /** Is used to handle timezone of date value */
    @Input() handleTimezone: boolean;
    /** Allows popup box to be attached to document.body */
    @Input() appendToBody: boolean;

    /** currently active date */
    @Input()
    get value(): Moment {
        return this._value;
    }

    set value(value: Moment) {
        if (!this.preserveInsignificant && value) {
            value.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        }
        if (!value || (value && value.isSame(this._value))) {
            return;
        }
        this.setDate(value);
        this.updateTextboxValue();
    }

    @Output()
    selectionDone: EventEmitter<Moment> = new EventEmitter<Moment>();

    /** callback to invoke when the value is changed. */
    @Output()
    valueChange: EventEmitter<Moment> = new EventEmitter<Moment>();

    @Output()
    calendarNavigated: EventEmitter<Moment> = new EventEmitter<Moment>();

    @Output()
    inputBlurred: EventEmitter<any> = new EventEmitter<Moment>();

    @ViewChild(DatePickerInnerComponent)
    _datePicker: DatePickerInnerComponent;

    @ViewChild("date") textbox: TextboxComponent;

    @ViewChild("popupArea", { static: true }) popupArea: ElementRef;
    @ViewChild(OverlayComponent) public overlay: OverlayComponent;

    public onDestroy$ = new Subject<void>();
    public customContainer: ElementRef | undefined;
    public selectedDate: Moment;
    public initDate: Moment;
    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS],
    };

    protected _value: Moment;
    protected _todayDate: Moment = moment();

    private formControl: FormControl;
    private inputChanged: Subject<string> = new Subject<string>();
    private momentDateFormat: string;
    private calendarChanged: Subscription;

    constructor(private cd: ChangeDetectorRef) {}

    public ngOnInit(): void {
        _defaults(this, datePickerDefaults);
        this.selectedDate = this._value;
        this.initDate = this.value && this.value.clone();
        this.setDateFormat();

        this.inputChanged.pipe(debounceTime(500)).subscribe((value: string) => {
            const momentValue = moment(value, datePickerDateFormats, true);
            this.onTouched();

            // In case of FormControl absence we still need to perform validation
            const templateDrivenControlValid =
                !this.formControl &&
                _isNull(NuiValidators.dateFormat(momentValue));
            const reactiveDrivenControlValid =
                this.formControl &&
                this.formControl.valid &&
                _isNull(NuiValidators.dateFormat(momentValue));
            const isInputValid =
                (templateDrivenControlValid || reactiveDrivenControlValid) &&
                !this.isDateDisabled(momentValue);

            this.setDate(momentValue);
            this.setErrorState(!isInputValid);

            if (
                this.value.isValid() &&
                !_isEqual(this.value.format(this.momentDateFormat), value)
            ) {
                this.updateTextboxValue();
            }
        });
        this.onAppendToBodyChange(this.appendToBody);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.appendToBody) {
            this.onAppendToBodyChange(changes.appendToBody.currentValue);
        }
    }

    public ngAfterViewInit(): void {
        this.calendarChanged = this._datePicker.calendarMoved.subscribe(
            (value: Moment) => this.calendarNavigated.emit(value)
        );
        this.updateTextboxValue();
        this.cd.detectChanges();
        if (this.overlay) {
            this.overlay.clickOutside
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((_) => this.overlay.hide());

            // Sets innerDatePicker 'value' to 'null' on popup close and refreshView() on popup open,
            // so in case datePicker.value is invalid it will build the calendar from the scratch
            // and not keep its previous state.

            this.overlay.show$
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((_) => this._datePicker.refreshView());
            this.overlay.hide$
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((_) => {
                    const currentDateValid = this.value?.isValid();
                    if (!currentDateValid) {
                        this._datePicker.value = undefined;
                        this._datePicker.datepickerMode = "day";
                    }
                });
        }
    }

    public updateTouchedState(): void {
        setTimeout(() => this.inputBlurred.emit(), 100);
        this.onTouched();
    }

    public onUpdate(event: Moment): void {
        this.value = event;
        this.selectionDone.emit(event);
        this.setErrorState(false);
    }

    private setDate(value: Moment): void {
        this._value = value;
        this.selectedDate = value;
        this.valueChange.emit(value);
        this.onChange(value);
    }

    public onInputActiveDateChanged(value: string): void {
        this.inputChanged.next(value);
    }

    public getIconColor(): string {
        return this.isDisabled ? "gray" : "primary-blue";
    }

    public onChange(value: any): void {}

    public onTouched(): void {}

    public validate(control: FormControl): ValidationErrors | null {
        this.formControl = control;
        return NuiValidators.dateFormat(control.value);
    }

    public writeValue(value: any): void {
        this.value = value;
    }

    public registerOnChange(fn: (value: any) => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    public setErrorState(isInErrorState: boolean): void {
        this.isInErrorState = isInErrorState;
    }

    public onSelectionDone(value: Moment): void {
        this.value = value;
        this.overlay?.hide();
    }

    private updateTextboxValue(value: any = this._value) {
        if (!this.textbox || !value) {
            return;
        }
        this.textbox.writeValue(moment(value).format(this.momentDateFormat));
    }

    private isDateDisabled(value: Moment): boolean {
        return this._datePicker.isDisabled(value);
    }

    private setDateFormat(): void {
        const isCustomFormatValid =
            !_isNil(this.dateFormat) &&
            moment(
                this._todayDate.format(this.dateFormat),
                datePickerDateFormats,
                true
            ).isValid();
        this.momentDateFormat = isCustomFormatValid
            ? this.dateFormat
            : datePickerDefaults.dateFormat;
    }

    public ngOnDestroy(): void {
        // The following resolves a known 'Error during cleanup of component:' error during unit tests
        // Details: https://github.com/angular/angular/issues/17013
        if (this.calendarChanged) {
            this.calendarChanged.unsubscribe();
        }

        if (this.overlay?.showing) {
            this.overlay.hide();
        }

        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private onAppendToBodyChange(appendToBody: boolean): void {
        this.customContainer = appendToBody ? undefined : this.popupArea;
    }
}
