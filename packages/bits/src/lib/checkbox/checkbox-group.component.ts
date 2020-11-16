import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    Output,
    QueryList,
    Renderer2,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import _remove from "lodash/remove";
import { Subscription } from "rxjs";

import { NuiFormFieldControl } from "../form-field/public-api";

import { CheckboxComponent } from "./checkbox.component";
import { CheckboxChangeEvent, ICheckboxComponent } from "./public-api";

@Component({
    selector: "nui-checkbox-group",
    templateUrl: "./checkbox-group.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => CheckboxGroupComponent),
            multi: true,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxGroupComponent),
            multi: true,
        },
    ],
})
/**
 * Component for combining of nui-checkbox components in to group
 * <example-url>./../examples/index.html#/checkbox-group</example-url>
 */
export class CheckboxGroupComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

    /**
     * Sets "name" attribute for inner input element of nui-checkbox
     */
    @Input() public name: string;

    /**
     * Stores values from selected nui-checkboxes children components
     */
    @Input() public values: any[];

    /**
     * Is emitted when nui-checkbox is selected
     */
    @Output() public valuesChange = new EventEmitter<any[]>();

    /**
     * CheckboxGroupComponent children array from CheckboxComponent items
     */
    @ContentChildren(CheckboxComponent, { descendants: true }) private children: QueryList<CheckboxComponent>;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel = "";

    private subscriptionsArray = new Array<Subscription>();
    private disabled: boolean = false;

    constructor(private renderer: Renderer2) { }

    /**
     * Subscribe to nui-checkbox-group children values change
     */
    public ngAfterViewInit(): void {
        this.children.toArray().forEach((child: ICheckboxComponent) => {
            this.renderer.setAttribute(child.inputViewContainer.element.nativeElement, "name", this.name);
            this.subscriptionsArray.push(
                this.subscribeToCheckboxEvent(child)
            );
            setTimeout(() => {
                child.checked = this.values.indexOf(child.value) > -1;
                child.disabled = child.disabled || this.disabled;
            });
        });

        this.children.changes.subscribe((checkboxComponentQueryList: QueryList<ICheckboxComponent>) => {
            // verify that there are no observers on checkboxes as we are creating new.
            this.subscriptionsArray.forEach(sub => sub.unsubscribe());
            checkboxComponentQueryList.toArray().forEach((checkbox: ICheckboxComponent) => {
                this.renderer.setAttribute(checkbox.inputViewContainer.element.nativeElement, "name", this.name);
                this.subscriptionsArray.push(
                    this.subscribeToCheckboxEvent(checkbox)
                );
                setTimeout(() => {
                    checkbox.checked = this.values.indexOf(checkbox.value) > -1;
                    checkbox.disabled = checkbox.disabled || this.disabled;
                });
            });
        });
    }

    public onChange(value: any[]) {
    }

    public onTouched() {
    }

    public writeValue(value: any) {
        this.values = value;
    }

    public registerOnChange(fn: (value: any[]) => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (this.children) {
            this.children.toArray().forEach(child => child.disabled = this.disabled);
        }
    }

    /**
     * Unsubscribe from valuesChange event
     */
    public ngOnDestroy(): void {
        this.subscriptionsArray.forEach(sub => sub.unsubscribe());
    }

    private subscribeToCheckboxEvent(checkbox: ICheckboxComponent): Subscription {
        return checkbox.valueChange.subscribe((event: CheckboxChangeEvent) => {
            if (event.target.checked) {
                this.values = [...this.values, event.target.value];
            } else {
                _remove(this.values, (x: any) =>
                    x === event.target.value);
            }
            this.valuesChange.emit(this.values);
            this.onChange(this.values);
            this.onTouched();
            this.writeValue(this.values);
        });
    }
}
