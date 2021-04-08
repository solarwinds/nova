import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
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
    host: { "role": "switch" },
})

export class SwitchComponent implements OnInit, ControlValueAccessor {
    @Input() public value: boolean;
    @Input() public disabled: boolean;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "";

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

    onChange(value: any) { }

    onTouched() { }

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

