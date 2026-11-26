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

import { ContentObserver } from "@angular/cdk/observers";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription } from "rxjs";

import { CheckboxChangeEvent, ICheckboxComponent } from "./public-api";
import {
    CHECKBOX_KEYDOWN_EVENT,
    DOCUMENT_CLICK_EVENT,
} from "../../constants/event.constants";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import { _uniqueId } from "../../functions/unique-id";
import { EventBusService } from "../../services/event-bus.service";
import { FormFieldDescription } from "../form-field/form-field-description";
import { formFieldCaptionRepeatsLabel } from "../form-field/form-field-label";
import { NuiFormFieldControl } from "../form-field/public-api";

@Component({
    selector: "nui-checkbox",
    templateUrl: "./checkbox.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true,
        },
    ],
    styleUrls: ["./checkbox.component.less"],
    // TODO: turn on the view envapsulation in the scope of NUI-5823
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.nui-checkbox--hovered]": "hovered",
        "[class.nui-checkbox--checked]": "checked",
    },
    standalone: false,
})

/**
 * <nui-checkbox> provides the same functionality as a native
 * <input type="checkbox"> enhanced with NUI styling.
 * <example-url>./../examples/index.html#/checkbox</example-url>
 */
export class CheckboxComponent
    implements
        AfterViewInit,
        ICheckboxComponent,
        ControlValueAccessor,
        OnDestroy
{
    private _checked: boolean;
    private _disabled: boolean;

    /**
     * Input to set aria label text
     */
    @Input() public get ariaLabel(): string {
        return this._ariaLabel ?? this.defaultAriaLabel;
    }

    // changing the value with regular @Input doesn't trigger change detection
    // so we need to do that manually in the setter
    public set ariaLabel(value: string | undefined) {
        if (value !== this._ariaLabel) {
            this._ariaLabel = value;
            this.changeDetector.markForCheck();
        }
    }

    /** Users ca specify the 'aria-labelledby' which will be set to the input element */
    @Input() ariaLabelledby: string | null = null;

    /** The 'aria-describedby' attribute is read after the element's label and field type. */
    @Input() public get ariaDescribedby(): string {
        return this._ariaDescribedby;
    }

    public set ariaDescribedby(value: string) {
        if (value !== this._ariaDescribedby) {
            this._ariaDescribedby = value;
            this.changeDetector.markForCheck();
        }
    }

    private _ariaDescribedby: string;
    private readonly formFieldDescription = new FormFieldDescription();

    /** Unique id for the control. */
    @Input() public id: string;

    /** Native input ID; in a form field, use it to associate an external label. */
    public get nativeControlId(): string | undefined {
        return this.formFieldControlId ?? this.id;
    }

    /**
     * Sets "name" attribute for inner input element of nui-checkbox
     */
    @Input() public name: string;

    /**
     * Sets "title" attribute for nui-checkbox label
     */
    @Input() public title = "";

    /**
     * Sets "value" attribute for inner input element of nui-checkbox
     */
    @Input() public value: any;

    /**
     * Event that is fired when nui-checkbox is toggled
     */
    @Output() public valueChange = new EventEmitter<CheckboxChangeEvent>();

    /**
     * Used for changing nui-checkbox component styles when component is hovered
     */
    @Input() public hovered: boolean;

    /**
     * Sets "checked" attribute for inner input element of nui-checkbox
     */
    @Input()
    public get checked(): boolean {
        return this._checked;
    }
    public set checked(val: boolean) {
        if (this._checked !== val) {
            this.changeDetector.markForCheck();
        }
        this._checked = val;
    }

    /**
     * Sets "required" attribute for inner input element of nui-checkbox
     */
    @Input() public required: boolean;

    /**
     * Sets nui-checkbox hint that is displayed below label
     */
    @Input() public hint: string;

    /**
     * Used for disabling of nui-checkbox
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
     * Used for setting of nui-checkbox indeterminate state
     */
    @Input() public indeterminate: boolean;

    /**
     * Reference to the inner input checkbox html element
     */
    @ViewChild("inputViewContainer", { read: ViewContainerRef })
    public inputViewContainer: ViewContainerRef;

    @ViewChild("checkboxContent")
    public checkboxContent: ElementRef;
    @ViewChild("checkboxLabel")
    public checkboxLabel: ElementRef;

    private rendererListener: Function;
    private sub: Subscription;
    private contentObserverSubscription: Subscription | undefined;
    private readonly contentObserver = inject(ContentObserver);

    public readonly defaultAriaLabel = $localize`Checkbox`;
    public readonly contentId = _uniqueId("nui-checkbox-content-");
    public readonly hintId = _uniqueId("nui-checkbox-hint-");

    private formFieldControlId: string | undefined;
    private _ariaLabel: string | undefined;
    private formFieldLabelId: string | undefined;
    private formFieldCaption: string | undefined;

    private keysAction = [KEYBOARD_CODE.SPACE, KEYBOARD_CODE.ENTER].map(String);

    constructor(
        private changeDetector: ChangeDetectorRef,
        private eventBusService: EventBusService,
        private renderer: Renderer2
    ) {}

    public ngAfterViewInit(): void {
        this.updateContentObserver();
        this.rendererListener = this.renderer.listen(
            this.inputViewContainer.element.nativeElement,
            "keydown",
            (event: KeyboardEvent) => {
                this.eventBusService
                    .getStream(CHECKBOX_KEYDOWN_EVENT)
                    .next(event);
            }
        );

        this.sub = this.eventBusService
            .getStream(CHECKBOX_KEYDOWN_EVENT)
            .subscribe(event => {
                if (
                    event.target ===
                    this.inputViewContainer.element.nativeElement
                ) {
                    if (this.keysAction.includes(event.code)) {
                        event.stopPropagation();
                        event.preventDefault();
                        if (!this.disabled) {
                            this.handleKeyboardActions();
                        }
                    }
                }
            });
    }

    public getAriaChecked(): "true" | "false" | "mixed" {
        if (this.indeterminate) {
            return "mixed";
        }

        if (this.checked) {
            return "true";
        }

        return "false";
    }

    public get descriptionIds(): string | null {
        return (
            [
                this.formFieldDescription.resolve(this.ariaDescribedby),
                this.hint ? this.hintId : null,
            ]
                .filter(Boolean)
                .join(" ") || null
        );
    }

    public setFormFieldDescription(id: string | undefined): void {
        if (this.formFieldDescription.set(id)) {
            this.changeDetector.markForCheck();
        }
    }

    public setFormFieldLabel(
        labelId: string | undefined,
        caption?: string
    ): void {
        if (
            this.formFieldLabelId !== labelId ||
            this.formFieldCaption !== caption
        ) {
            this.formFieldLabelId = labelId;
            this.formFieldCaption = caption;
            this.updateContentObserver();
            this.changeDetector.markForCheck();
        }
    }

    public setFormFieldControlId(id: string | undefined): void {
        if (this.formFieldControlId !== id) {
            this.formFieldControlId = id;
            this.changeDetector.markForCheck();
        }
    }

    public get labelIds(): string | null {
        if (this.ariaLabelledby) {
            return this.ariaLabelledby;
        }
        if (this._ariaLabel) {
            return null;
        }
        const captionId = formFieldCaptionRepeatsLabel(
            this.formFieldCaption,
            this.checkboxContent?.nativeElement.textContent
        )
            ? undefined
            : this.formFieldLabelId;
        return [captionId, this.contentId].filter(Boolean).join(" ");
    }

    // OnPush does not see projected text changes, which decide whether the caption repeats it.
    private updateContentObserver(): void {
        const shouldObserve = !!this.formFieldCaption && !!this.checkboxContent;
        if (shouldObserve && !this.contentObserverSubscription) {
            this.contentObserverSubscription = this.contentObserver
                .observe(this.checkboxContent.nativeElement)
                .subscribe(() => this.changeDetector.markForCheck());
        } else if (!shouldObserve && this.contentObserverSubscription) {
            this.contentObserverSubscription.unsubscribe();
            this.contentObserverSubscription = undefined;
        }
    }

    /**
     * Used for changing of css style when nui-checkbox is hovered
     */
    public hoverHandler(): void {
        this.hovered = !this.hovered;
    }

    /**
     * nui-checkbox check/uncheck state handler
     * @param event Changed nui-checkbox component
     */
    public changeHandler(event: CheckboxChangeEvent): void {
        this.indeterminate = false;
        this.changeDetector.markForCheck();
        this.valueChange.emit(event);
        const checked = !!event.target?.checked;
        this.onChange(checked);
        this.onTouched();
        this.writeValue(checked);
    }

    public onClick(event: MouseEvent): void {
        event.stopPropagation();
        this.eventBusService.getStream(DOCUMENT_CLICK_EVENT).next(event);
    }

    public onChange(value: any): void {}

    public onTouched(): void {}

    public writeValue(value: any): void {
        this.checked = value;
    }

    public registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public ngOnDestroy(): void {
        if (this.rendererListener) {
            this.rendererListener();
        }
        if (this.sub) {
            this.sub.unsubscribe();
        }
        this.contentObserverSubscription?.unsubscribe();
    }

    private handleKeyboardActions(): void {
        if (this.indeterminate) {
            this.inputViewContainer.element.nativeElement.checked = true;
            this.indeterminate = false;
        } else {
            this.inputViewContainer.element.nativeElement.checked =
                !this.inputViewContainer.element.nativeElement.checked;
        }
        this.inputViewContainer.element.nativeElement.dispatchEvent(
            new Event("change")
        );
    }
}
