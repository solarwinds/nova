import { ENTER, SPACE } from "@angular/cdk/keycodes";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {Subscription} from "rxjs";

import { DOCUMENT_CLICK_EVENT } from "../../constants/event.constants";
import { EventBusService } from "../../services/event-bus.service";
import { NuiFormFieldControl } from "../form-field/public-api";

import { CheckboxChangeEvent, ICheckboxComponent } from "./public-api";

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
})

/**
 * <nui-checkbox> provides the same functionality as a native
 * <input type="checkbox"> enhanced with NUI styling.
 * <example-url>./../examples/index.html#/checkbox</example-url>
 */
export class CheckboxComponent implements AfterViewInit, ICheckboxComponent, ControlValueAccessor, OnDestroy {

    private _checked: boolean;
    private _disabled: boolean;

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
            this.changeDetector.markForCheck();
        }
    }

    /** Users ca specify the 'aria-labelledby' which will be set to the input element */
    @Input() ariaLabelledby: string | null = null;

    /** The 'aria-describedby' attribute is read after the element's label and field type. */
    @Input() ariaDescribedby: string;

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

    private _ariaLabel: string = "";

    constructor(private changeDetector: ChangeDetectorRef,
                private eventBusService: EventBusService,
                private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.rendererListener = this.renderer.listen(this.checkboxLabel.nativeElement, "keydown", (event) => {
            this.eventBusService.getStream({id: "checkbox-keydown"}).next(event);
        });

        this.sub = this.eventBusService.getStream({id: "checkbox-keydown"}).subscribe((event: KeyboardEvent) => {
            if (event.target === this.checkboxLabel.nativeElement) {
                if (event.keyCode === ENTER || event.keyCode === SPACE) {
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
        if (this.checked) {
            return "true";
        }

        return this.indeterminate ? "mixed" : "false";
    }

    /**
     * Used for changing of css style when nui-checkbox is hovered
     */
    public hoverHandler() {
        this.hovered = !this.hovered;
    }

    /**
     * nui-checkbox check/uncheck state handler
     * @param event Changed nui-checkbox component
     */
    public changeHandler(event: CheckboxChangeEvent) {
        this.valueChange.emit(event);
        this.onChange(event.target.checked);
        this.onTouched();
        this.writeValue(event.target.checked);
    }

    public onClick(event: Event) {
        event.stopPropagation();
        this.eventBusService.getStream({id: DOCUMENT_CLICK_EVENT}).next(event);
    }

    public onChange(value: any) {}

    public onTouched() {}

    public writeValue(value: any) {
        this.checked = value;
    }

    public registerOnChange(fn: (value: boolean) => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public ngOnDestroy() {
        if (this.rendererListener) {
            this.rendererListener();
        }
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    private handleKeyboardActions(): void {
        if (this.indeterminate) {
            this.inputViewContainer.element.nativeElement.checked = true;
            this.indeterminate = false;
        } else {
            this.inputViewContainer.element.nativeElement.checked = !this.inputViewContainer.element.nativeElement.checked;
        }
        this.inputViewContainer.element.nativeElement.dispatchEvent(new Event("change"));
    }
}
