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

import { CheckboxComponent } from "./checkbox.component";
import { CheckboxChangeEvent, ICheckboxComponent } from "./public-api";
import { NuiFormFieldControl } from "../form-field/public-api";

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
    host: { role: "group" },
    standalone: false,
})
/**
 * Component for combining of nui-checkbox components in to group
 * <example-url>./../examples/index.html#/checkbox-group</example-url>
 */
export class CheckboxGroupComponent
    implements AfterViewInit, OnDestroy, ControlValueAccessor
{
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
    @ContentChildren(CheckboxComponent, { descendants: true })
    private children: QueryList<CheckboxComponent>;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel = "Checkbox Group";

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabeledby = "";

    private subscriptionsArray = new Array<Subscription>();
    private disabled: boolean = false;

    constructor(private renderer: Renderer2) {}

    /**
     * Subscribe to nui-checkbox-group children values change
     */
    public ngAfterViewInit(): void {
        this.children.toArray().forEach((child: ICheckboxComponent) => {
            this.renderer.setAttribute(
                child.inputViewContainer.element.nativeElement,
                "name",
                this.name
            );
            this.subscriptionsArray.push(this.subscribeToCheckboxEvent(child));
            setTimeout(() => {
                child.checked = this.values.indexOf(child.value) > -1;
                child.disabled = child.disabled || this.disabled;
            });
        });

        this.children.changes.subscribe(
            (checkboxComponentQueryList: QueryList<ICheckboxComponent>) => {
                // verify that there are no observers on checkboxes as we are creating new.
                this.subscriptionsArray.forEach((sub) => sub.unsubscribe());
                checkboxComponentQueryList
                    .toArray()
                    .forEach((checkbox: ICheckboxComponent) => {
                        this.renderer.setAttribute(
                            checkbox.inputViewContainer.element.nativeElement,
                            "name",
                            this.name
                        );
                        this.subscriptionsArray.push(
                            this.subscribeToCheckboxEvent(checkbox)
                        );
                        setTimeout(() => {
                            checkbox.checked =
                                this.values.indexOf(checkbox.value) > -1;
                            checkbox.disabled =
                                checkbox.disabled || this.disabled;
                        });
                    });
            }
        );
    }

    public onChange(value: any[]): void {}

    public onTouched(): void {}

    public writeValue(value: any): void {
        this.values = value;
    }

    public registerOnChange(fn: (value: any[]) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (this.children) {
            this.children
                .toArray()
                .forEach((child) => (child.disabled = this.disabled));
        }
    }

    /**
     * Unsubscribe from valuesChange event
     */
    public ngOnDestroy(): void {
        this.subscriptionsArray.forEach((sub) => sub.unsubscribe());
    }

    private subscribeToCheckboxEvent(
        checkbox: ICheckboxComponent
    ): Subscription {
        return checkbox.valueChange.subscribe((event: CheckboxChangeEvent) => {
            if (event.target.checked) {
                this.values = [...this.values, event.target.value];
            } else {
                _remove(this.values, (x: any) => x === event.target.value);
            }
            this.valuesChange.emit(this.values);
            this.onChange(this.values);
            this.onTouched();
            this.writeValue(this.values);
        });
    }
}
