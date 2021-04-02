import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import includes from "lodash/includes";
import isEqual from "lodash/isEqual";

import { NuiFormFieldControl } from "../../form-field/public-api";
import { IOptionValueObject, OptionValueType } from "../../overlay/types";
import { BaseSelectV2 } from "../base-select-v2";
import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { MarkAsSelectedItemDirective } from "../mark-as-selected-item.directive";
import { OptionKeyControlService } from "../option-key-control.service";
import { SelectV2OptionComponent } from "../option/select-v2-option.component";
import { SelectedItemsKeyControlService } from "../selected-items-key-control.service";
import { InputValueTypes } from "../types";

// <example-url>./../examples/index.html#/combobox-v2</example-url>

@Component({
    selector: "nui-combobox-v2",
    templateUrl: "combobox-v2.component.html",
    styleUrls: ["combobox-v2.component.less"],
    providers: [
        OptionKeyControlService,
        SelectedItemsKeyControlService,
        {
            provide: NUI_SELECT_V2_OPTION_PARENT_COMPONENT,
            useExisting: ComboboxV2Component,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ComboboxV2Component),
            multi: true,
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => ComboboxV2Component),
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        "class": "nui-combobox-v2",
        "role": "combobox",
        "[attr.aria-expanded]": "isDropdownOpen || false",
    },
})

// Will be renamed in scope of the NUI-5797
export class ComboboxV2Component extends BaseSelectV2 implements AfterContentInit, OnDestroy, OnChanges, AfterViewInit {

    /** Function that maps an Option's control value to its display value */
    @Input() public displayWith: ((value: any) => string) | null = null;

    /** Whether the control for removing value enabled */
    @Input() public isRemoveValueEnabled: boolean = true;

    /** Whether to populate the remainder of the text being typed */
    @Input() public isTypeaheadEnabled: boolean = true;

    /** Emits event whether options are presented after filtering */
    @Output() public searchEmpty = new EventEmitter<boolean>(false);

    /** Emits event whether the typed text is unique among presented options */
    @Output() public canCreateOption = new EventEmitter<boolean>(false);

    /** Grabs and init keyboard navigation service for the "Selected Items" */
    @ContentChildren(MarkAsSelectedItemDirective, {descendants: true}) set selectedItems(elems: QueryList<MarkAsSelectedItemDirective>) {
        this.selectedItemsKeyControlService.initSelectedItemsKeyManager(elems, this);
    }

    /** Value of the Combobox Input */
    public inputValue: string | number;

    /** Text of the Clear Button tooltip */
    public clearValueButtonTooltip: string;

    constructor(elRef: ElementRef,
                optionKeyControlService: OptionKeyControlService<SelectV2OptionComponent>,
                cdRef: ChangeDetectorRef,
                private selectedItemsKeyControlService: SelectedItemsKeyControlService
                ) {
        super(optionKeyControlService, cdRef, elRef);
    }

    public ngAfterContentInit() {
        this.clearValueButtonTooltip = this.multiselect ? $localize `Remove all` : $localize `Remove`;
        // applying changes to content immediately after it was initialized (checked)
        // causes "Expression has changed after it was checked" error
        setTimeout(() => {
            super.ngAfterContentInit();

            if (!this.multiselect) {
                this.setInputValue(this.getLastSelectedOption()?.value);
            }

            this.cdRef.markForCheck();
        });

        // options may be received after value changes, that's why
        // we check "selectedOptions" to be set per "value" again in "handleValueChange"
        this.optionsChanged().subscribe(() => {
            this.filterItems(this.inputValue.toString());
            this.cdRef.markForCheck();
        });
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        if (!this.multiselect) {
            this.dropdown.hide$.subscribe(() => {
                const lastSelectedOption = this.getLastSelectedOption();
                if (lastSelectedOption) {
                    this.setInputValue(lastSelectedOption.viewValue);
                    this.filterItems(this.inputValue.toString());
                    this.cdRef.markForCheck();
                }
            });
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    /** Handles behavior on mouseup event */
    public onMouseUp(target: HTMLElement) {
        this.mouseDown = false;
        if (!this.manualDropdownControl) {
            if (target !== this.inputElement.nativeElement && !this.dropdown.showing) {
                this.inputElement.nativeElement.focus();
                return;
            }
            this.toggleDropdown();
        }
    }

    /** Handles behavior on keydown event */
    public onKeyDown(event: KeyboardEvent) {
        super.onKeyDown(event);
        this.selectedItemsKeyControlService.onKeydown(event);

        if (this.selectedItemsKeyControlService.isSelectedItemsActive()) {
            this.optionKeyControlService.resetActiveItem();
        } else if (this.optionKeyControlService.getActiveItemIndex() === -1) {
            this.optionKeyControlService.setFirstItemActive();
        }

    }

    /** Toggles dropdown and removes focus from Selected Items */
    public toggleDropdown() {
        super.toggleDropdown();
        this.selectedItemsKeyControlService.deactivateSelectedItems();
    }

    /** Selects specific option and set its value to the model */
    public selectOption(option: SelectV2OptionComponent) {
        if (option.outfiltered || option.isDisabled) {
            return;
        }

        super.selectOption(option);

        this.setInputValue(option.value);
        this.filterItems();

        if (this.multiselect) {
            this.optionKeyControlService.setFirstItemActive();
        }

        this.cdRef.markForCheck();
    }

    /**
     * @param  {OptionValueType} item   Deselect using value
     * @param  {number} item            Deselect using index in multiselect values array
     * Deselects item from Selected Items by index or value
     */
    public deselectItem(item: OptionValueType | number) {
        let option: SelectV2OptionComponent | undefined;

        if (typeof item === "number" && this.multiselect) {
            const value = (this.value as Array<IOptionValueObject>)[item as number];
            option = this.options.find(o => isEqual(o.value, value));
        } else {
            option = this.options.find(o => isEqual(o.value, item));
        }

        if (option) {
            this.removeSelected(option);
            this.filterItems();
            this.optionKeyControlService.setFirstItemActive();
        }
    }

    /** Handles behavior on Input value change */
    public handleInput(inputValue: InputValueTypes) {
        if (!inputValue && !this.multiselect) {
            this.clearValue();
            return;
        }

        this.filterItems(inputValue.toString());

        if (!this.manualDropdownControl) {
            this.showDropdown();
        }

        this.valueChanged.emit(inputValue);
    }

    /** Selects text in Input */
    public selectTextInInput(): void {
        if (!this.isDropdownOpen) {
            return;
        }
        setTimeout(() => this.inputElement.nativeElement.select());
    }

    /** Sets value to the model */
    public writeValue(value: OptionValueType | OptionValueType[]): void {
        super.writeValue(value);
        this.setInputValue(value);
        this.cdRef.markForCheck();
    }

    /** Clears up Combobox to the initial value */
    public clearValue(event?: Event, keepDropdown?: boolean) {
        if (!this.isDisabled) {
            this.selectedOptions = [];
            this.onTouched();
            this.setInputValue("");
            this.removeSelected();
            event?.stopPropagation(); // To avoid triggering dropdown open/close
            this.filterItems();
            this.optionKeyControlService.setFirstItemActive();

            if (!keepDropdown && !this.manualDropdownControl) {
                this.dropdown.hide();
            }
        }
    }

    /*
     * Calls to ngOnDestroy do not automatically get propagated to base classes.
     * This can lead to memory leaks.
     * This is a safe guard for preventing memory leaks in derived classes.
     */
    ngOnDestroy() {
        super.ngOnDestroy();
    }

    protected handleValueChange (value: OptionValueType | OptionValueType[] | null): void {
        if (this.multiselect) {
            this.selectedOptions.forEach(selectedOption => selectedOption.outfiltered = false);
        }
        super.handleValueChange(value);
    }

    private setInputValue(value: any): void {
        const inputValueToSet = this.multiselect ? "" : value;
        const toDisplay = this.displayWith ? this.displayWith(inputValueToSet) : inputValueToSet;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        this.inputValue = toDisplay || "";
        this.valueChanged.emit(this.inputValue);
    }

    private filterItems(searchValue?: InputValueTypes) {
        if (this.isTypeaheadEnabled) {
            let filterValue = searchValue?.toString().toLowerCase() || "";

            if (!this.multiselect) {
                // if inputValue is the same as selectedOption, search for "" to display all the options
                filterValue = this.getLastSelectedOption()?.viewValue.toLowerCase() === filterValue
                    ? ""
                    : filterValue;
            }

            this.options.forEach(option => {
                const optionName = option.viewValue.toLowerCase();
                option.outfiltered = !includes(optionName, filterValue);
            });

            if (this.multiselect) {
                this.selectedOptions.forEach(selectedOption => selectedOption.outfiltered = true);
            }

            this.emitSearchResults();
        }
    }

    private emitSearchResults(): void {
        const allOutfiltered = !this.options.some((option => !option.outfiltered));
        this.searchEmpty.emit(allOutfiltered);
        this.canCreateOption.emit(this.isInputValueUnique());
    }

    private isInputValueUnique(): boolean {
        const optionName = (option: SelectV2OptionComponent) => option?.viewValue.toLowerCase();
        const inputValue = this.inputValue.toString().toLowerCase();

        return Boolean(this.inputValue && !this.options.find(option => optionName(option) === inputValue));
    }
}
