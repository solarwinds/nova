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
  input
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
    standalone: false,
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
    public readonly caption = input<string>(undefined!);
    /**
     * Use to enable or disable input autocomplete from browser. Default value is "on".
     */
    public readonly autocomplete = input<"on" | "off">("on");
    /**
     * Value used as a info in popover for the text box.
     */
    public readonly info = input<string>(undefined!);

    /**
     * Use to set a custom width for the input field.
     */
    public readonly customBoxWidth = input<string>(undefined!);
    /**
     * Event fired when input text is changed.
     */
    @Output() public textChange = new EventEmitter<string | number>();
    /**
     * The option to disable the text box.
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() public disabled = false;
    /**
     * Help content provided below the text box.
     */
    public readonly hint = input("");
    /**
     * Name of the element.
     */
    public readonly name = input<string>(undefined!);
    /**
     * Value used as a placeholder for the text box.
     */
    public readonly placeholder = input("");
    /**
     * The option to make the text box read only.
     */
    public readonly readonly = input(false);
    /**
     * Makes textbox multiline (textarea), specifies rows count
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() public rows = 1;

    /**
     * Use to set type of input (number, password etc.).
     */
    public readonly type = input("text");

    /**
     * Input initial value
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() public value: string;

    /**
     * Input to apply error state styles
     */
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    @Input() public isInErrorState: boolean = false;

    /**
     * Input to set aria label text
     */
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    // TODO: Skipped for migration because:
    //  This input overrides a field from a superclass, while the superclass field
    //  is not migrated.
    @Input() public ariaLabel: string = "Textbox input";

    /**
     * Input to apply busy state and show spinner
     */
    public readonly isBusy = input<boolean>(undefined!);

    /**
     * Event fired when textbox is focused out.
     */
    @Output() blurred: EventEmitter<any> = new EventEmitter<any>();

    // i18n nui_textbox_optional
    private optionalText = "Optional";

    public focus(): void {
        this.textboxInput.nativeElement.focus();
    }

    public onBlurEventEmit(): void {
        this._onTouched();
        this.blurred.emit(this.value);
    }

    public onChangeEvent($event: any): void {
        if ($event.target.value !== this.value) {
            this.changeValue($event);
            this.textChange.emit(this.value);
        }
    }

    onChange(value: any): void {}

    _onTouched(): void {}

    public writeValue(value: string): void {
        this.value = value;
    }

    public registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
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
