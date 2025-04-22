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
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ITableWidgetColumnConfig } from "../../../../../../../components/table-widget/types";
import { onMarkAsTouched } from "../../../../../../../functions/on-mark-as-touched";

@Component({
    selector: "nui-table-column-configuration",
    templateUrl: "./table-column-configuration.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TableColumnConfigurationComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => TableColumnConfigurationComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class TableColumnConfigurationComponent
    implements ControlValueAccessor, OnInit, OnDestroy
{
    public static lateLoadKey = "TableColumnConfigurationComponent";

    public form: FormGroup;
    public changeFn: Function;

    private readonly destroy$ = new Subject<void>();
    private input: ITableWidgetColumnConfig;

    @Input() formControl: AbstractControl;
    @Input() isWidthMessageDisplayed = false;

    constructor(
        private formBuilder: FormBuilder,
        public changeDetector: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.group({
            description: this.formBuilder.control({}),
            presentation: this.formBuilder.control({}),
        });

        this.form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const newValue = {
                    id: this.input?.id,
                    ...value.description,
                    formatter: value.presentation,
                };
                this.changeFn(newValue);
            });
    }

    public ngOnInit(): void {
        onMarkAsTouched(this.formControl, () => {
            this.form.markAllAsTouched();
        });
    }

    public registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {}

    public validate(c: FormControl): ValidationErrors | null {
        return this.form.valid ? null : { error: "error" };
    }

    public writeValue(obj: ITableWidgetColumnConfig): void {
        this.input = obj;

        this.form.setValue(
            {
                presentation: obj?.formatter || {},
                description: obj,
            },
            { emitEvent: false }
        );

        this.changeDetector.markForCheck();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
