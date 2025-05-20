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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validators,
} from "@angular/forms";
import { noop, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { getTimeUnitsRatio, TimeUnit, TIME_UNITS_LONG } from "./time-units";
import { NumberValidationParams } from "./types";

/**
 * As per Wolfi, this is a candidate for reworking into a general time interval selector implemented as a Web Component
 */
@Component({
    selector: "nui-refresh-rate-configurator",
    templateUrl: "./refresh-rate-configurator.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RefreshRateConfiguratorComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RefreshRateConfiguratorComponent),
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefreshRateConfiguratorComponent
    implements ControlValueAccessor, OnInit, OnDestroy
{
    @Input() minSeconds: number;
    @Input() maxSeconds: number;

    possibleUnits = [TimeUnit.Second, TimeUnit.Minute, TimeUnit.Hour];

    unitItems: any[] = [];
    displayedUnitItems: any[] = [];

    form: FormGroup;
    numberControl: FormControl;
    unitControl: FormControl;
    currentUnit: TimeUnit | null = null;

    valueChangeFix = noop; // TODO this can be removed after NUI-3442 is fixed

    private onChange: (value: number | null) => void;
    private destroy$ = new Subject<void>();

    constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

    public ngOnInit(): void {
        this.generateUnitItems();
        this.filterUnitItems();
        this.createForm();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getNumberMin(): number | undefined {
        if (!this.unitControl.value || this.minSeconds == null) {
            return undefined;
        }

        const ratio = getTimeUnitsRatio(
            TimeUnit.Second,
            this.unitControl.value.id
        );
        return Math.ceil(this.minSeconds * ratio);
    }

    getNumberMax(): number | undefined {
        if (!this.unitControl.value || this.maxSeconds == null) {
            return undefined;
        }

        const ratio = getTimeUnitsRatio(
            TimeUnit.Second,
            this.unitControl.value.id
        );
        return Math.floor(this.maxSeconds * ratio);
    }

    writeValue(seconds: number): void {
        if (
            isFinite(seconds) &&
            this.isRangeValid() &&
            this.unitControl.value
        ) {
            const ratio = getTimeUnitsRatio(
                TimeUnit.Second,
                this.unitControl.value.id
            );
            const num = seconds * ratio;

            this.numberControl.setValue(num);
        } else {
            this.numberControl.setValue(null);
        }
        this.cd.markForCheck();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {}

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.numberControl.disable({ emitEvent: false });
            this.unitControl.disable({ emitEvent: false });
        } else {
            this.numberControl.enable({ emitEvent: false });
            this.unitControl.enable({ emitEvent: false });
        }
        this.cd.markForCheck();
    }

    resetUnits(): void {
        this.unitControl.setValue(this.displayedUnitItems[0]);
    }

    private generateUnitItems() {
        this.possibleUnits.forEach((item, index) => {
            this.unitItems[index] = {
                id: item,
                label: TIME_UNITS_LONG[item],
            };
        });
    }

    private filterUnitItems() {
        this.displayedUnitItems = this.unitItems.filter((item) => {
            let tooLarge = false;

            if (this.maxSeconds != null) {
                const ratio = getTimeUnitsRatio(TimeUnit.Second, item.id);
                tooLarge = Math.floor(this.maxSeconds * ratio) <= 0;
            }

            return !tooLarge;
        });
    }

    private createForm() {
        this.form = this.fb.group({
            number: [1, [Validators.required]],
            unit: this.displayedUnitItems[0],
        });

        this.numberControl = this.form.get("number") as FormControl;
        this.unitControl = this.form.get("unit") as FormControl;
        if (this.unitControl.value) {
            this.currentUnit = this.unitControl.value.id;
        }

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.updateError();
            this.emitValueChange();
        });
    }

    private updateError() {
        if (this.isNumberValid()) {
            this.numberControl.setErrors(null);
        } else {
            this.numberControl.setErrors({ invalidNumber: true });
        }
    }

    private emitValueChange() {
        const num = this.numberControl.value;
        const unit = this.unitControl.value;
        if (num == null || unit == null) {
            if (this.onChange) {
                this.onChange(null);
            }
            return;
        }

        const ratio = getTimeUnitsRatio(unit.id, TimeUnit.Second);
        const seconds = num * ratio;

        if (this.onChange) {
            this.onChange(seconds);
        }
    }

    private isRangeValid(): boolean {
        return this.minSeconds <= this.maxSeconds || this.maxSeconds == null;
    }

    public isNumberValid(): boolean {
        const num = this.numberControl.value;
        const unit = this.unitControl.value;

        if (num < this.minSeconds) {
            return false;
        }
        if (num % 1 !== 0) {
            return false;
        }
        const ratio = getTimeUnitsRatio(unit.id, TimeUnit.Second);
        const seconds = num * ratio;
        if (seconds > this.maxSeconds) {
            return false;
        }

        return this.isRangeValid();
    }

    public getNumberValidationMessage(): string {
        const validationParams: NumberValidationParams = {
            min: this.getNumberMin(),
            max: this.getNumberMax(),
            whole: true,
        };
        return this.getLocalizedNumberValidationMessage(validationParams);
    }

    public getLocalizedNumberValidationMessage(
        params: NumberValidationParams
    ): string {
        const { min, max, whole } = params;
        const numberTypeText = whole
            ? $localize`a whole number`
            : $localize`a number`;

        if (min != null && max != null) {
            if (min === max) {
                return $localize`Must be ${numberTypeText} equal to ${min}`;
            }
            return $localize`Must be ${numberTypeText} between ${min} and ${max}`;
        }
        if (min == null && max != null) {
            return $localize`Must be ${numberTypeText} not larger than ${max}`;
        }
        if (min != null && max == null) {
            return $localize`Must be ${numberTypeText} not smaller than ${min}`;
        }
        return $localize`Must be ${numberTypeText}`;
    }

    public validate(): ValidationErrors | null {
        // TODO: Check this, when number FormControl is undefined casting
        //  it to null to avoid changing the signature
        return this.form.get("number")?.errors || null;
    }
}
