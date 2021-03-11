import { DOWN_ARROW, ENTER, UP_ARROW } from "@angular/cdk/keycodes";
import { OverlayConfig } from "@angular/cdk/overlay";
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import includes from "lodash/includes";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import last from "lodash/last";
import pull from "lodash/pull";
import { Observable, Subject } from "rxjs";
import { delay, takeUntil, tap } from "rxjs/operators";

import { OVERLAY_ITEM, OVERLAY_WITH_POPUP_STYLES_CLASS } from "../overlay/constants";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { OverlayUtilitiesService } from "../overlay/overlay-utilities.service";
import { IOption, OptionValueType, OverlayContainerType } from "../overlay/types";

import { OptionKeyControlService } from "./option-key-control.service";
import { SelectV2OptionComponent } from "./option/select-v2-option.component";
import { InputValueTypes, IOptionedComponent } from "./types";

const DEFAULT_SELECT_OVERLAY_CONFIG: OverlayConfig = {
    panelClass: OVERLAY_WITH_POPUP_STYLES_CLASS,
};

// Will be renamed in scope of the NUI-5797
@Directive()
export abstract class BaseSelectV2 implements AfterViewInit, AfterContentInit, ControlValueAccessor, IOptionedComponent, OnDestroy, OnChanges {

    /** Value used as a placeholder for the select. */
    @Input() public placeholder: string = "";

    /** Sets margin in px for the Dropdown relatively the container where the Dropdown appended to */
    @Input() public popupViewportMargin: number;

    /** Sets the Overlay Config in accordance with [Material CDK]{@link https://material.angular.io/cdk/overlay/api#OverlayConfig} */
    @Input()
    public get overlayConfig(): OverlayConfig {
        return this._overlayConfig;
    }
    public set overlayConfig(value: OverlayConfig) {
        this._overlayConfig = {
            ...DEFAULT_SELECT_OVERLAY_CONFIG,
            ...value,
        };
    }
    private _overlayConfig: OverlayConfig = DEFAULT_SELECT_OVERLAY_CONFIG;

    /** Whether the multi-select mode */
    @Input() public multiselect: boolean;

    /** Whether the Dropdown controls manually */
    @Input() public manualDropdownControl: boolean = false;

    /** Sets value of the Select/Combobox */
    @Input() public value: OptionValueType | OptionValueType[] | null;

    /** Sets custom container for CDK Overlay. Selector OR ElementRef */
    @Input() public dropdownCustomContainer: OverlayContainerType;

    /** Sets whether an overlay must sync it's width with the width of the toggle reference */
    @Input() public syncWidth: boolean = true;

    /** Whether the Select/Combobox disabled */
    @HostBinding("class.disabled")
    @Input() public isDisabled = false;

    /** Input to apply error state styles */
    @HostBinding("class.has-error")
    @Input() public isInErrorState: boolean;

    /** Input to set aria label text */
    @Input() public get ariaLabel(): string {
        return this._ariaLabel;
    }

    // changing the value with regular @Input doesn't trigger change detection
    // so we need to do that manually in the setter
    public set ariaLabel(value: string) {
        if (value !== this._ariaLabel) {
            this._ariaLabel = value;
            this.cdRef.markForCheck();
        }
    }

    /** Corresponds to the Textbox of the Combobox */
    @ViewChild("input", { static: false})
    inputElement: ElementRef;

    /** Corresponds to the Options listed in the Dropdown */
    @ContentChildren(forwardRef(() => SelectV2OptionComponent), { descendants: true })
    public options: QueryList<SelectV2OptionComponent>;

    /** Corresponds to the All Items listed in the Dropdown */
    @ContentChildren(forwardRef(() => OVERLAY_ITEM), { descendants: true })
    public allPopupItems: QueryList<IOption>;

    /** Gets options from the model */
    public get selectedOptions(): SelectV2OptionComponent[] {
        return this._selectedOptions;
    }
    /** Sets options to the model */
    public set selectedOptions(options: SelectV2OptionComponent[]) {
        this._selectedOptions = options;
        const value = this.getValueFromOptions(options);
        this.value = value;
        this.onChange(value);
        this.valueSelected.emit(value);
    }

    /** Name of the icon which indicates open/close state of the Dropdown */
    public caretIcon = "caret-down";

    @ViewChild(OverlayComponent)
    public dropdown: OverlayComponent;
    protected popupUtilities: OverlayUtilitiesService = new OverlayUtilitiesService();
    protected destroy$: Subject<void> = new Subject();
    protected mouseDown: boolean;
    private _selectedOptions: SelectV2OptionComponent[] = [];

    private _ariaLabel: string = "";

    /** Emits value which has been selected */
    @Output() public valueSelected = new EventEmitter<OptionValueType | OptionValueType[] | null>();

    /** Emits value which has been changed */
    @Output() public valueChanged = new EventEmitter<InputValueTypes>();

    /** Emits MouseEvent when click occurs outside Select/Combobox */
    @Output() public clickOutsideDropdown = new EventEmitter<MouseEvent>();

    protected constructor(protected optionKeyControlService: OptionKeyControlService<IOption>,
                          protected cdRef: ChangeDetectorRef,
                          public elRef: ElementRef<HTMLElement>) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.handleValueChange(changes.value?.currentValue);
        }

        if (changes.dropdownCustomContainer && this.dropdown) {
            this.defineDropdownContainer();
        }
    }

    public ngAfterContentInit(): void {
        this.handleValueChange(this.value);
    }

    public ngAfterViewInit(): void {
        this.initClosingOnClicksOutside();
        this.initOnTouch();
        if (this.syncWidth) {
            this.initPopupUtilities();
        }
        this.initKeyboardManager();
        this.defineDropdownContainer();
    }

    /** `View -> model callback called when value changes` */
    public onChange: (value: any) => void = () => { };

    /** `View -> model callback called when autocomplete has been touched` */
    public onTouched = () => { };

    /** Handles mousedown event */
    @HostListener("mousedown")
    public onMouseDown() {
        this.mouseDown = true;
    }

    /** Handles mouseup event */
    @HostListener("mouseup", ["$event.target"])
    public onMouseUp(target: HTMLElement) {
        this.mouseDown = false;
        if (!this.manualDropdownControl) {
            this.toggleDropdown();
        }
    }

    /**
     * Handles focusin event.
     * To avoid triggering showDropdown() on MouseClick. We need to open dropdown only on TAB (SHIFT + TAB) action.
     */
    @HostListener("focusin")
    public onFocusIn() {
        if (!this.mouseDown && !this.manualDropdownControl) {
            this.showDropdown();
        }
    }

    @HostListener("window:resize")
    public onWindowResize() {
        this.popupUtilities.syncWidth();
    }

    /** Handles keydown event */
    public onKeyDown(event: KeyboardEvent) {
        if (!this.manualDropdownControl) {
            this.optionKeyControlService.handleKeydown(event);
        }

        if (this.manualDropdownControl && this.dropdown.showing && this.isAllowedKeyOnManualDropdown(event)) {
            this.optionKeyControlService.handleKeydown(event);
        }
    }

    /** Shows dropdown */
    public showDropdown(): void {
        if (this.isDisabled) {
            return;
        }

        this.dropdown.show();
        this.setActiveItemOnDropdown();
        this.scrollToOption();
    }

    /** Hides dropdown */
    public hideDropdown(): void {
        if (!this.isDisabled) {
            this.dropdown.hide();
        }
    }

    /** Toggles dropdown */
    public toggleDropdown() {
        if (this.isDisabled) {
            return;
        }

        this.dropdown.toggle();

        this.setActiveItemOnDropdown();
        this.scrollToOption();
    }

    /** Selects specific option and set its value to the model */
    public selectOption(option: SelectV2OptionComponent): void {
        if (includes(this.selectedOptions, option) && !this.manualDropdownControl) {
            this.hideDropdown();
            return;
        }

        this.selectedOptions = this.multiselect ? this.selectedOptions.concat(option) : [option];
        this.optionKeyControlService.setActiveItem(option);

        if (!this.manualDropdownControl) {
            this.hideDropdown();
        }
    }

    /** Removes selected options or passed option if multi-select mode enabled */
    public removeSelected(option?: SelectV2OptionComponent) {
        if (!this.multiselect) { return; }

        this.selectedOptions = option ? pull(this.selectedOptions, option) : [];
    }

    public registerOnChange(fn: (value: any) => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /** Handles disabled state */
    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    /** Sets value to the model */
    public writeValue(value: OptionValueType | OptionValueType[]): void {
        this.handleValueChange(value);
    }

    /** Returns last selected Option */
    public getLastSelectedOption(): SelectV2OptionComponent | undefined {
        return last(this.selectedOptions);
    }

    /** Returns state of the Dropdown */
    public get isDropdownOpen(): boolean {
        return this.dropdown?.showing;
    }

    /**
     * Calls to ngOnDestroy do not automatically get propagated to base classes.
     * This can lead to memory leaks.
     * This is a safe guard for preventing memory leaks in derived classes.
     */
    public ngOnDestroy() {
        if (this.dropdown?.showing) {
            this.dropdown.hide();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    protected getValueFromOptions(options = this.selectedOptions): OptionValueType | OptionValueType[] | null {
        return this.multiselect ? options.map(o => o.value) : options[0]?.value || null;
    }

    protected handleValueChange(value: OptionValueType | OptionValueType[] | null) {
        if (isNil(value)) {
            this.value = "";
            this._selectedOptions = [];
            this.setActiveItemOnDropdown();
            return;
        }

        this.value = value;

        if (this.multiselect && Array.isArray(value)) {
            // Using type assertion to avoid compilation error, undefined elements are filtered but compiler do not infer the type properly
            this._selectedOptions = <SelectV2OptionComponent[]>(value.map(v => this.options?.find(option => isEqual(option.value, v)))
                .filter(_ => _)); // removes 'undefined' elements out of the array if any
            this._selectedOptions.forEach(option => option.outfiltered = true);

        } else {
            const modelValue: OptionValueType = value;
            const selectedValue = this.options?.find(option => isEqual(option.value, modelValue));
            this._selectedOptions = selectedValue ? [selectedValue] : [];
        }
        this.valueChanged.emit();
        this.setActiveItemOnDropdown();
    }

    protected optionsChanged(): Observable<QueryList<IOption>> {
        return this.allPopupItems.changes
            .pipe(
                takeUntil(this.destroy$),
                delay(0), // because we handle options as list of COMPONENTS, so we need to wait till next check
                tap(() => {
                    this.handleValueChange(this.value);
                    this.validateValueWithSelectedOptions();
                    this.optionKeyControlService.setFirstItemActive();
                })
            );
    }

    private validateValueWithSelectedOptions() {
        const selectedOptionValues = this.selectedOptions.map(option => option.value);
        const valuePropToCompare = this.value
            ? this.multiselect ? this.value : [this.value]
            : [];

        if (!isEqual(selectedOptionValues, valuePropToCompare)) {
            this.value = this.multiselect ? selectedOptionValues : selectedOptionValues[0];
            this.onChange(this.value);
            console.warn("Options changed, no correspondent 'value' found. Current value: ", this.value, "Previous value: ", valuePropToCompare);
        }
    }

    private scrollToOption() {
        // setTimeout is necessary because scrolling to the selected item should occur only when overlay rendered
        if (this.value && !this.multiselect) {
            setTimeout(() => this.selectedOptions[0]?.scrollIntoView({ block: "center" }));
        }
    }

    private initKeyboardManager() {
        this.optionKeyControlService.optionItems = this.allPopupItems;
        this.optionKeyControlService.popup = this.dropdown;
        this.optionKeyControlService.initKeyboardManager();
        this.optionKeyControlService.setSkipPredicate((option: IOption) => !!(option.outfiltered || option.isDisabled));
    }

    private setActiveItemOnDropdown(): void {
        this.value && !this.multiselect
            ? this.optionKeyControlService.setActiveItem(this.selectedOptions[0])
            : this.optionKeyControlService.setFirstItemActive();
    }

    private initClosingOnClicksOutside() {
        this.dropdown.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe((v) => {
                if (!this.manualDropdownControl) { this.hideDropdown(); }
                this.clickOutsideDropdown.emit(v);
            });
    }

    private initOnTouch() {
        this.dropdown.hide$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.onTouched();
                this.cdRef.markForCheck(); // so caret icon will update properly
            });
    }

    private isAllowedKeyOnManualDropdown(event: KeyboardEvent): Boolean {
        return Boolean([UP_ARROW, DOWN_ARROW, ENTER].find((i: number) => i === event.keyCode));
    }

    private defineDropdownContainer(): void {
        this.dropdown.customContainer = this.dropdownCustomContainer;
    }

    private initPopupUtilities() {
        const resizeObserver = this.popupUtilities
            .setPopupComponent(this.dropdown)
            .getResizeObserver();

        this.dropdown.show$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.popupUtilities.syncWidth();
            resizeObserver.observe(this.elRef.nativeElement);
        });

        this.dropdown.hide$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            resizeObserver.unobserve(this.elRef.nativeElement);
        });
    }
}
