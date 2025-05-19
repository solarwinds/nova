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
    ChangeDetectionStrategy,
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
    Validators,
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ITableWidgetColumnConfig } from "../../../../../../../components/table-widget/types";
import { onMarkAsTouched } from "../../../../../../../functions/on-mark-as-touched";
import { IHasChangeDetector } from "../../../../../../../types";

@Component({
    selector: "nui-description-configuration-v2",
    templateUrl: "./description-configuration-v2.component.html",
    styleUrls: ["./description-configuration-v2.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DescriptionConfigurationV2Component),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DescriptionConfigurationV2Component),
            multi: true,
        },
    ],
    standalone: false,
})
export class DescriptionConfigurationV2Component
    implements IHasChangeDetector, ControlValueAccessor, OnDestroy, OnInit
{
    static lateLoadKey = "DescriptionConfigurationV2Component";

    @Input() formControl: AbstractControl;
    @Input() isWidthMessageDisplayed = false;

    public form: FormGroup;
    public changeFn: Function;

    private readonly destroy$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        public changeDetector: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.group({
            label: ["", [Validators.required]],
            isActive: true,
            width: undefined,
        });

        this.form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.changeFn?.(value);
            });
    }

    public registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    public validate(c: FormControl): ValidationErrors | null {
        return this.form.valid ? null : { nestedForm: true };
    }

    public writeValue(obj: ITableWidgetColumnConfig): void {
        this.form.patchValue(
            {
                label: obj.label,
                isActive: obj.isActive,
                width: obj.width,
            },
            { emitEvent: false }
        );

        this.changeDetector.markForCheck();
    }

    public ngOnInit(): void {
        onMarkAsTouched(this.formControl, () => {
            this.form.markAllAsTouched();
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public stub(): void {
        // empty function to hotfix textbox-number behavior (NUI-3442)
    }

    public isWidthMessageDisplayedForThisColumn(): boolean {
        const width = this.form.controls["width"].value;
        return this.isWidthMessageDisplayed && typeof width !== "number";
    }
}
