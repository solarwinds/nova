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
    AfterContentInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    QueryList,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import _isNil from "lodash/isNil";
import _isUndefined from "lodash/isUndefined";
import { Subscription } from "rxjs";

import { DOCUMENT_CLICK_EVENT } from "../../constants/event.constants";
import { EventBusService } from "../../services/event-bus.service";
import { NuiFormFieldControl } from "../form-field/public-api";

/*
 * <example-url>./../examples/index.html#/radio-group</example-url>
 */
@Component({
    selector: "nui-radio-group",
    template: `<div class="nui-radio-group" [attr.aria-label]="ariaLabel">
        <ng-content></ng-content>
    </div>`,
    providers: [
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => RadioGroupComponent),
            multi: true,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioGroupComponent),
            multi: true,
        },
    ],
    host: { role: "radiogroup" },
    standalone: false,
})
export class RadioGroupComponent
    implements AfterContentInit, OnDestroy, ControlValueAccessor
{
    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "";

    /**
     * Sets the "name" attribute for each radio button in the group
     */
    @Input() public name: string;

    /**
     * Stores the value from selected radio
     */
    @Input()
    get value(): any {
        return this._value;
    }
    set value(newValue: any) {
        if (this._value !== newValue) {
            // Set this before proceeding to ensure no circular loop occurs with selection.
            this._value = newValue;

            this.updateSelectedRadioFromValue();
            this.checkSelectedRadioButton();
        }
    }

    /**
     * Sets whether the group is disabled
     */
    @Input() public disabled?: boolean;

    /**
     * Emits an event when the radio selection changes
     */
    @Output() public valueChange = new EventEmitter<any>();

    @ContentChildren(forwardRef(() => RadioComponent), { descendants: true })
    private children: QueryList<RadioComponent>;
    private _value: any = null;
    private selectedRadio: RadioComponent | null = null;
    private subscriptions = new Array<Subscription>();
    constructor(private renderer: Renderer2) {}

    private registerChild(child: RadioComponent): void {
        this.renderer.setAttribute(
            child.inputViewContainer.element.nativeElement,
            "name",
            this.name
        );
        this.subscriptions.push(this.subscribeToRadioEvent(child));
        // timeout to prevent "expression changed after it has been checked" error
        setTimeout(() => {
            this.setChildDisabled(child);
        });
    }

    public ngAfterContentInit(): void {
        this.children.toArray().forEach((child) => this.registerChild(child));
        this.children.changes.subscribe(
            (radioComponentQueryList: QueryList<RadioComponent>) => {
                this.subscriptions.forEach((sub) => sub.unsubscribe());
                radioComponentQueryList
                    .toArray()
                    .forEach((child) => this.registerChild(child));
            }
        );
    }

    public onChange(value: any): void {}

    public onTouched(): void {}

    public writeValue(value: any): void {
        this.value = value;
    }

    public registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (this.children) {
            this.children.toArray().forEach(this.setChildDisabled);
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    private setChildDisabled = (child: RadioComponent) => {
        if (!_isUndefined(this.disabled)) {
            child.disabled = this.disabled;
        }
    };

    private checkSelectedRadioButton() {
        if (this.selectedRadio && !this.selectedRadio.checked) {
            this.selectedRadio.checked = true;
        }
    }

    private updateSelectedRadioFromValue(): void {
        // If the value already matches the selected radio, do nothing.
        const isAlreadySelected =
            this.selectedRadio !== null &&
            this.selectedRadio.value === this._value;
        if (this.children && !isAlreadySelected) {
            this.children.forEach((radio) => {
                radio.checked = this.value === radio.value;
                if (radio.checked) {
                    this.selectedRadio = radio;
                }
            });
        }
    }

    private subscribeToRadioEvent(radio: RadioComponent): Subscription {
        return radio.valueChange.subscribe((value: any) => {
            this.value = value;
            this.valueChange.emit(value);
            if (!radio.keepFormPristine) {
                this.onChange(this.value);
                this.onTouched();
            }
            this.writeValue(this.value);
        });
    }
}

/**
 * @ignore
 * Should be used only within nui-radio-group.
 */
@Component({
    selector: "nui-radio",
    templateUrl: "./radio.component.html",
    styleUrls: ["./radio.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.nui-radio--hovered]": "hovered",
        "[class.nui-radio--checked]": "checked",
        role: "radio",
    },
    standalone: false,
})
export class RadioComponent implements OnInit, OnDestroy {
    /**
     * Sets the radio instance value
     */
    @Input() public value: any;

    /**
     * Emits an event when the value changes
     */
    @Output() public valueChange = new EventEmitter<any>();

    @Input() public hovered: boolean;

    /**
     * Sets whether the radio button is selected
     */
    @Input() public checked = false;

    /**
     * Adds hint text under the radio button
     */
    @Input() public hint?: string;

    /**
     * Sets whether the radio button is disabled
     */
    @Input()
    public get disabled(): boolean {
        return this._disabled;
    }
    public set disabled(val: boolean) {
        if (this._disabled !== val) {
            this.changeDetector.markForCheck();
        }
        this._disabled = val;
    }

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "";

    @ViewChild("inputViewContainer", { static: true, read: ViewContainerRef })
    public inputViewContainer: ViewContainerRef;

    @ViewChild("radioTransclude", { static: true })
    public radioTransclude: ElementRef;

    public radioTranscludeIsEmpty: boolean;
    public keepFormPristine: boolean = true;

    private timeoutId: number;
    private _disabled: boolean = false;

    readonly radioGroup: RadioGroupComponent | null;

    @ContentChildren("[nui-radio-hint]")
    protected contentHints: QueryList<TemplateRef<any>>;

    constructor(
        @Optional() radioGroup: RadioGroupComponent,
        private changeDetector: ChangeDetectorRef,
        private eventBusService: EventBusService
    ) {
        this.radioGroup = radioGroup;
    }

    public ngOnInit(): void {
        if (this.radioGroup !== null) {
            if (this.radioGroup.value === this.value) {
                this.checked = true;
            }
        }

        if (this.checked) {
            // TODO: remove timeout in v10 NUI-4843
            // nui-radio-group should subscribe before event is emitted
            this.timeoutId = (<any>setTimeout(() => {
                this.valueChange.emit(this.value);
            }, 0)) as number;
        }

        // Checks if user supplied any content as a label for radio button to adjust styles for radio buttons without labels
        this.radioTranscludeIsEmpty = _isNil(
            this.radioTransclude.nativeElement.firstChild
        );
    }

    public ngOnDestroy(): void {
        clearTimeout(this.timeoutId);
    }

    public hoverHandler(): void {
        this.hovered = !this.hovered;
    }

    public changeHandler(): void {
        this.keepFormPristine = false;
        this.valueChange.emit(this.value);
    }

    public onInputClick(event: MouseEvent): void {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `radio-button` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
        this.eventBusService.getStream(DOCUMENT_CLICK_EVENT).next(event);
    }
}
