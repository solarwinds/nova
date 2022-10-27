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
    Output,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { NuiFormFieldControl } from "../form-field/public-api";

// <example-url>./../examples/index.html#/textbox</example-url>

/**
 * __Name :__
 * NUI Textbox component.
 *
 */
@Component({
    selector: "nui-textbox",
    templateUrl: "./textbox.component.html",
    providers: [
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => TextboxComponent),
            multi: true,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextboxComponent),
            multi: true,
        },
    ],
    styleUrls: ["./textbox.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class TextboxComponent
    implements ControlValueAccessor, NuiFormFieldControl
{
    /**
     * Used to access input and textarea native elements
     */
    @ViewChild("textboxInput") public textboxInput: ElementRef;
    /**
     * Value used as a label for the text box.
     */
    @Input() public caption: string;
    /**
     * Use to enable or disable input autocomplete from browser. Default value is "on".
     */
    @Input() public autocomplete: "on" | "off" = "on";
    /**
     * Value used as a info in popover for the text box.
     */
    @Input() public info: string;

    /**
     * Use to set a custom width for the input field.
     */
    @Input() public customBoxWidth: string;
    /**
     * Event fired when input text is changed.
     */
    @Output() public textChange = new EventEmitter<string | number>();
    /**
     * The option to disable the text box.
     */
    @Input() public disabled = false;
    /**
     * Help content provided below the text box.
     */
    @Input() public hint = "";
    /**
     * Name of the element.
     */
    @Input() public name: string;
    /**
     * Value used as a placeholder for the text box.
     */
    @Input() public placeholder = "";
    /**
     * The option to make the text box read only.
     */
    @Input() public readonly = false;
    /**
     * Makes textbox multiline (textarea), specifies rows count
     */
    @Input() public rows = 1;

    /**
     * Use to set type of input (number, password etc.).
     */
    @Input() public type = "text";

    /**
     * Input initial value
     */
    @Input() public value: string;

    /**
     * Input to apply error state styles
     */
    @Input() public isInErrorState: boolean = false;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "Textbox input";

    /**
     * Input to apply busy state and show spinner
     */
    @Input() public isBusy: boolean;

    /**
     * Event fired when textbox is focused out.
     */
    @Output() blurred: EventEmitter<any> = new EventEmitter<any>();

    // i18n nui_textbox_optional
    private optionalText = "Optional";

    public focus() {
        this.textboxInput.nativeElement.focus();
    }

    public onBlurEventEmit() {
        this._onTouched();
        this.blurred.emit(this.value);
    }

    public onChangeEvent($event: any) {
        if ($event.target.value !== this.value) {
            this.changeValue($event);
            this.textChange.emit(this.value);
        }
    }

    onChange(value: any) {}

    _onTouched() {}

    public writeValue(value: string) {
        this.value = value;
    }

    public registerOnChange(fn: () => void) {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}) {
        this._onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private changeValue(event: any) {
        this.writeValue(event.target.value);
        this.onChange(this.value);
    }
}
