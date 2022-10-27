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
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { NuiFormFieldControl } from "../form-field/public-api";

/**
 * <example-url>./../examples/index.html#/switch</example-url>
 */
@Component({
    selector: "nui-switch",
    templateUrl: "./switch.component.html",
    providers: [
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true,
        },
    ],
    styleUrls: ["./switch.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
})
export class SwitchComponent implements OnInit, ControlValueAccessor {
    @Input() public value: boolean;
    @Input() public disabled: boolean;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "Switch";

    @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    toggle() {
        if (this.disabled) {
            return;
        }

        const toggledValue = !this.value;
        this.valueChange.emit(toggledValue);

        // this is here because of a bug in reactive forms,
        // that causes the UI not to update when a value is updated on the FormControl
        // https://github.com/angular/angular/issues/13792
        this.value = toggledValue;

        this.onChange(toggledValue);
        this.onTouched();
    }

    onChange(value: any) {}

    onTouched() {}

    writeValue(value: any) {
        if (value !== undefined) {
            this.value = value;
        }
    }

    registerOnChange(fn: (value: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    ngOnInit(): void {
        this.value = !!this.value;
    }
}
