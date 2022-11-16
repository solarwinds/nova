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
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
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
import isNumber from "lodash/isNumber";
import isUndefined from "lodash/isUndefined";
import round from "lodash/round";

import { KEYBOARD_CODE } from "../../../constants/keycode.constants";
import { regexpValidation } from "../../../constants/regex.constants";
import { NuiFormFieldControl } from "../../form-field/public-api";

// <example-url>./../examples/index.html#/textbox/textbox-number</example-url>

@Component({
    selector: "nui-textbox-number",
    templateUrl: "./textbox-number.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextboxNumberComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => TextboxNumberComponent),
            multi: true,
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => TextboxNumberComponent),
            multi: true,
        },
    ],
    styleUrls: ["../textbox.component.less", "./textbox-number.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        role: "spinbutton",
        "[attr.aria-label]": "ariaLabel",
        "[attr.aria-valuemin]": "minValue || null",
        "[attr.aria-valuemax]": "maxValue || null",
        "[attr.aria-valuenow]": "value || 0",
    },
})
export class TextboxNumberComponent
    implements ControlValueAccessor, NuiFormFieldControl, OnChanges
{
    private static createRangeValidator(
        min: number,
        max: number
    ): (c: FormControl) => ValidationErrors | null {
        const rangeValidator = (c: FormControl) => {
            if (!c.value && c.value !== 0) {
                return null;
            }

            if (
                (!isUndefined(max) && c.value > max) ||
                (!isUndefined(min) && c.value < min)
            ) {
                return {
                    range: {
                        given: c.value,
                        max,
                        min,
                    },
                };
            }

            return null;
        };

        return rangeValidator;
    }

    /**
     * Value that is exposed through ControlValueAccessor
     */
    @Input() public value: any = null;

    /**
     * Use to set a custom width for the input field.
     */
    @Input() public customBoxWidth: string;
    /**
     * The option to disable the textboxNumber.
     */
    @Input() public disabled = false;
    /**
     * Name of the element.
     */
    @Input() public name: string;
    /**
     * Value used as a placeholder for the text box.
     */
    @Input() public placeholder = "";
    /**
     * The option to make the textboxNumber read only.
     */
    @Input() public readonly = false;

    /**
     * Step by which the value are increased/decreased
     * when clicking on up/down buttons
     */
    @Input() step: number = 1;

    /**
     * The decimal precision to use for rounding each step increase/decrease
     * when clicking the up/down buttons
     */
    @Input() stepPrecision: number = 10;

    /**
     * Input to apply error state styles
     */
    @Input() public isInErrorState: boolean = false; // TODO: do we need to hook this up?

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "Textbox number input";

    /**
     * Minimum value of textBoxNumber component
     */
    @Input() public minValue: number;
    /**
     * Maximum value of textBoxNumber component
     */
    @Input() public maxValue: number;
    /**
     * Event fired when textBoxNumber is focused out.
     */
    @Output() blurred: EventEmitter<any> = new EventEmitter<any>();

    @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild("numberInput", { static: true })
    private input: ElementRef<HTMLFieldSetElement>;

    public formControl: FormControl;

    public isRepeatable = true;

    private validatorFn: (c: FormControl) => ValidationErrors | null;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["minValue"] || changes["maxValue"]) {
            this.validatorFn = TextboxNumberComponent.createRangeValidator(
                this.minValue,
                this.maxValue
            );
        }
    }

    public onBlurEventEmit(): void {
        this.onTouched();
        this.blurred.emit(this.value);
    }

    public addNumber(valueChange: number): void {
        if (isUndefined(this.value) || isNaN(this.value)) {
            this.value = 0;
        }
        // Explicitly converting current value to number because it can also be a string, and cause issues, like NUI-5599
        const newValue = this.clampToRange(Number(this.value) + valueChange);

        this.onValueChange(round(newValue, this.stepPrecision));
    }

    public onValueChange(value: any): void {
        this.value = value;

        setTimeout(() => {
            this.onChange(this.value);
            this.valueChange.emit(this.value);

            this.onTouched();
        });
    }

    public onChange(value: any): void {}

    public onTouched(): void {}

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
        this.disabled = isDisabled;
    }

    public compareMin(): boolean {
        return this.value <= this.minValue;
    }

    public compareMax(): boolean {
        return this.value >= this.maxValue;
    }

    public validate(c: FormControl): ValidationErrors | null {
        this.formControl = c;
        return (
            (this.validatorFn ? this.validatorFn(c) : null) ||
            this.nativeValidator()
        );
    }

    public hasError(): boolean {
        return (
            (this.formControl?.touched || this.formControl?.dirty) &&
            !this.formControl?.valid
        );
    }

    private nativeValidator(): ValidationErrors | null {
        if (this.input.nativeElement.validity.valid) {
            return null;
        }

        return { format: "Invalid input" };
    }

    private clampToRange(value: number): number {
        if (!isNumber(value)) {
            return value;
        }
        if (value > this.maxValue) {
            return this.maxValue;
        }
        if (value < this.minValue) {
            return this.minValue;
        }
        return value;
    }

    // We need to restrict user input because safari does not prevent non numerical input in type 'number'
    public preventNonNumericalPaste(event: ClipboardEvent): void {
        const pastedString: String | undefined =
            event.clipboardData?.getData("text/plain");
        if (!pastedString) {
            throw new Error("Unable to parse clipboardData");
        }
        this.preventDefaultEventBehavior(
            event,
            pastedString,
            regexpValidation.multiCharNumeric
        );
    }

    public preventNonNumericalInput(event: KeyboardEvent): void {
        const inputString: String = event.key;
        if (!this.isMetaKey(event)) {
            this.preventDefaultEventBehavior(
                event,
                inputString,
                regexpValidation.singleCharNumeric
            );
        }
    }

    private preventDefaultEventBehavior(
        event: KeyboardEvent | ClipboardEvent,
        inputString: String,
        regexp: RegExp
    ): void {
        if (!inputString?.match(regexp)) {
            event.preventDefault();
        }
    }

    private isMetaKey(event: KeyboardEvent): boolean {
        return (
            event.ctrlKey ||
            event.metaKey ||
            event.code === KEYBOARD_CODE.BACKSPACE ||
            event.code === KEYBOARD_CODE.DELETE ||
            event.code === KEYBOARD_CODE.TAB ||
            event.code === KEYBOARD_CODE.ARROW_DOWN ||
            event.code === KEYBOARD_CODE.ARROW_LEFT ||
            event.code === KEYBOARD_CODE.ARROW_RIGHT ||
            event.code === KEYBOARD_CODE.ARROW_UP
        );
    }
}
