import {
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
} from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import _includes from "lodash/includes";
import _isEqual from "lodash/isEqual";
import _isFunction from "lodash/isFunction";
import _isNil from "lodash/isNil";
import _isObject from "lodash/isObject";
import _isString from "lodash/isString";
import _some from "lodash/some";
import { map } from "rxjs/operators";

import { UtilService } from "../../services/util.service";
import { NuiFormFieldControl } from "../form-field/public-api";

import { ISelectChangedEvent, ISelectGroup } from "./public-api";

/**
 * @deprecated in v11 - Use BaseSelectV2 instead - Removal: NUI-5796
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseSelect
    implements OnInit, OnChanges, ControlValueAccessor, NuiFormFieldControl
{
    /**
     * The option to disable the select.
     */
    @Input() isDisabled: boolean;
    /**
     * The option to make select inline.
     */
    @Input() inline: boolean;
    /**
     * The option to fill width of a container.
     */
    @Input() justified: boolean;
    /**
     * Array of values that are bound to the repeat of dropdown items. If you want to have grouped data you need to pass
     * data as ISelectGroup[].
     */
    @Input() itemsSource: any[] | ISelectGroup[];
    /**
     * Receives item that will be selected before user starts to communicate with select component
     */
    @Input() value: any;
    /**
     * The icon to be rendered.
     */
    @Input() icon: string;
    /**
     * Template for formatting selected item on the dropdown button. Used only with nui-select.
     */
    @Input() displayFormat: string;
    /**
     * Name of the item property that will be shown in the dropdown menu.
     */
    @Input() displayValue: string;
    /**
     * Name of the item property that will be used as the model.
     */
    @Input() modelValue: string;
    /**
     * Value used as a placeholder for the select.
     */
    @Input() placeholder: string;
    /**
     * Needed to provide own template for every item in select you need to link `customTemplate` input with `TemplateRef`
     * that represents custom template
     */
    @Input() customTemplate: TemplateRef<string>;
    /**
     * Input to apply error state styles
     */
    @Input() isInErrorState: boolean;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "";

    /**
     * Value for enabling remove value feature
     */
    @Input() isRemoveValueEnabled: boolean = false;
    /**
     *
     * Change event. To subscribe to it you should pass a function, argument of which is ISelectChangeEvent object.
     */
    @Output() changed = new EventEmitter<ISelectChangedEvent<any>>();

    @Output() valueChange = this.changed.pipe(map(({ newValue }) => newValue));

    public name: string;
    public selectedItem: any;
    public displayValueFn: (params: { item: any }) => string;
    public itemToSelect: any;
    public inputValue: string;

    protected constructor(protected utilService: UtilService) {}

    ngOnInit() {
        this.selectedItem = this.value;
        this.inputValue = this.value ? this.value : "";
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["value"] && !changes["value"].firstChange) {
            const value = changes["value"].currentValue;
            const isInArray = this.displayValue
                ? _some(this.itemsSource, value)
                : _includes(this.itemsSource, value);

            if (isInArray) {
                this.select(changes["value"].currentValue);
            }
        }

        if (changes.itemsSource && this.selectedItem && this.modelValue) {
            if (_isString(this.selectedItem)) {
                const newItemsSource = changes.itemsSource.currentValue as
                    | any[]
                    | ISelectGroup[];

                const itemToSelect = newItemsSource.find(
                    (i) => i[this.modelValue] === this.selectedItem
                );
                if (itemToSelect) {
                    this.select(itemToSelect);
                }
            }
        }
    }

    abstract displayPlaceholder(): boolean;

    abstract handleBlur(event: any): void;

    public getItemDisplay(item: any): any {
        if (_isNil(item)) {
            return "";
        }

        if (this.displayValue) {
            return item[this.displayValue];
        } else if (_isFunction(this.displayValueFn)) {
            const value = this.displayValueFn({ item });

            if (value) {
                return value;
            }
        }

        return item;
    }

    public getDisplayValueFormatted(item: any): string {
        if (_isNil(item)) {
            return "";
        }

        if (this.displayFormat) {
            const displayedItem = this.getItemDisplay(item);

            // handle the case where item isn"t empty
            // but is garbage w.r.t this.displayValue
            if (_isNil(displayedItem)) {
                return "";
            }

            return this.utilService.formatString(
                this.displayFormat,
                displayedItem
            );
        }

        return this.getItemDisplay(item);
    }

    public getIconColor() {
        return this.isDisabled ? "gray" : "primary-blue";
    }

    public isItemSelected(item: any): boolean {
        const selectedItem = this.getSelectedItem();
        const currentItem =
            this.displayValue && !_isObject(selectedItem)
                ? item[this.displayValue]
                : item;

        return _isEqual(selectedItem, currentItem);
    }

    public getSelectedItem(): any {
        if (!_isNil(this.itemToSelect)) {
            return this.itemToSelect;
        }

        return this.selectedItem;
    }

    public select(item: any): void {
        const oldValue = this.selectedItem;
        if (!_isEqual(oldValue, item)) {
            const newValue = this.getItemModel(item);
            this.changed.emit({ newValue: newValue, oldValue });
            this.changeValue(newValue);
        } else if (item === "") {
            // Making this check to trigger reactive form validation if initial value is set to empty string
            // after focus and blur they will be equal and after blur changeValue is not triggered and combobox is pristine.
            this.changeValue("");
        }
    }

    public getItemModel(item: any) {
        return item && this.modelValue ? item[this.modelValue] : item;
    }

    public onChange(value: any) {}

    public onTouched() {}

    public writeValue(value: any): void {
        let selectedItem: any;
        if (this.modelValue && this.itemsSource && this.itemsSource.length) {
            selectedItem = this.itemsSource.find(
                (item) => this.getItemModel(item) === value
            );
        } else {
            selectedItem = value;
        }
        this.selectedItem = selectedItem;

        this.inputValue = _isObject(selectedItem)
            ? this.getItemDisplay(selectedItem)
            : selectedItem;
    }

    public registerOnChange(fn: () => void) {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    public changeValue(value: any) {
        this.writeValue(value);
        this.onChange(value);
        this.onTouched();
    }

    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }
}
