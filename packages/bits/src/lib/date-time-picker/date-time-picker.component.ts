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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  output
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import moment from "moment/moment";
import { Moment } from "moment/moment";

import { NuiFormFieldControl } from "../form-field/public-api";

// <example-url>./../examples/index.html#/date-time-picker</example-url><br />

@Component({
    selector: "nui-date-time-picker",
    templateUrl: "./date-time-picker.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimePickerComponent),
            multi: true,
        },
        {
            provide: NuiFormFieldControl, // this allows our form control to use run-time type checking
            useExisting: forwardRef(() => DateTimePickerComponent),
            multi: true,
        },
    ],
    styleUrls: ["./date-time-picker.component.less"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class DateTimePickerComponent
    implements AfterViewInit, OnInit, ControlValueAccessor
{
    /** latest available date */
    @Input() maxDate: Moment;
    /** earliest available date */
    @Input() minDate: Moment;
    /** sets mode of showing date-time-picker */
    @Input() displayMode: string;

    @Input() isDisabled: boolean;

    @Input() initEmpty: boolean;
    /** Is used to handle timezone of date value, passed to DatePickerComponent */
    @Input() handleTimezone: boolean;
    /** Allows popup box to be attached to document.body */
    @Input() appendToBody: boolean;

    /**
     * Input to set aria label text
     */
    @Input() public get ariaLabel(): string {
        return this._ariaLabel;
    }

    // changing the value with regular @Input doesn't trigger change detection
    // so we need to do that manually in the setter
    public set ariaLabel(value: string) {
        if (value !== this._ariaLabel) {
            this._ariaLabel = value;
            this.cd.markForCheck();
        }
    }

    @ViewChild("nuiDatetimePicker", { static: true })
    public codeElement: ElementRef;
    /** Callback to invoke on model change */
    readonly modelChanged = output<Moment>();

    /** model of picker */
    @Input()
    get model(): Moment | undefined {
        return this._model;
    }

    set model(value: Moment | undefined) {
        if (moment(value).isValid()) {
            this._model = value;
        }
        this.updateChildrenModels();
    }

    public date?: Moment;
    public time?: Moment;
    private _model?: Moment;
    public isInErrorStateDate = false;
    public isInErrorStateTime = false;

    private _ariaLabel: string = "";

    onTouched = (): void => {};
    onChange = (value: any): void => {};

    constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) {}

    public ngOnInit(): void {
        if (!this.initEmpty && !this.model) {
            this.model = moment();
            this.onChange(this.model);
            this.cd.markForCheck();
        }
    }

    public ngAfterViewInit(): void {
        if (this.displayMode === "inline") {
            this.renderer.addClass(
                this.codeElement.nativeElement,
                "nui-datetime-picker--inline"
            );
            this.renderer.addClass(
                this.codeElement.nativeElement.querySelector(".nui-timepicker"),
                "nui-dropdown--inline"
            );
        }
    }

    writeValue(value: Moment): void {
        this.model = value;
        this.updateChildrenModels();
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
        this.cd.markForCheck(); // This is needed to update "disabled" state for child date and time pickers
    }

    onTimeChanged(event: Moment): void {
        this.updateTime(event);
        this.modelChanged.emit(moment(this.model));
        this.onChange(this.model);
        this.onTouched();
    }

    onDateChanged(event: Moment): void {
        const isDateTheSame =
            moment.isMoment(this.date) && this.date.isSame(event);

        if (isDateTheSame) {
            return;
        }

        this.updateDate(event);
        this.modelChanged.emit(moment(this.model));
        this.onChange(this.model);
        this.onTouched();
    }

    onInputBlurred(): void {
        this.onTouched();
        if (!this.model) {
            this.isInErrorStateDate =
                !this.date || (this.date && !moment(this.date).isValid());
            this.isInErrorStateTime =
                !this.time || (this.time && !moment(this.time).isValid());
        }
    }

    private updateChildrenModels() {
        if (this.model) {
            this.date = this.model.clone();
            this.time = this.model.clone();
        } else if (!this.model && this.initEmpty) {
            // TODO: Replace with undefined
            // @ts-ignore
            this.date = null;
            // @ts-ignore
            this.time = null;
        }
    }

    private updateDate(newValue: Moment | null) {
        if (!moment.isMoment(newValue) || !moment(newValue).isValid()) {
            // TODO: Replace with undefined
            // @ts-ignore
            this._model = null;
            // @ts-ignore
            this.date = null;
            return;
        }

        // In case 'date' is not set, this._model is set from 'time' model if 'time' model exists
        this._model = this._model || (this.time && this.time.clone());
        if (this._model) {
            this._model.set({
                year: newValue.year(),
                month: newValue.month(),
                date: newValue.date(),
            });
        }

        this.date = newValue.clone();
    }

    private updateTime(newValue: Moment) {
        if (!moment.isMoment(newValue)) {
            // TODO: Replace with undefined
            // @ts-ignore
            this._model = null;
            // @ts-ignore
            this.time = null;
            return;
        }

        // In case 'time' is not set, this._model is set from 'date' model if 'date' model exists
        this._model = this._model || (this.date && this.date.clone());
        if (this._model) {
            this._model.set({
                hours: newValue.hours(),
                minutes: newValue.minutes(),
                seconds: newValue.seconds(),
                milliseconds: newValue.millisecond(),
            });
        }

        this.time = newValue.clone();
    }
}
