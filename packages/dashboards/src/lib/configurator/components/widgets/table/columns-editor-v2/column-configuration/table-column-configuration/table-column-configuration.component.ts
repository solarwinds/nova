import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ITableWidgetColumnConfig } from "../../../../../../../components/table-widget/types";

@Component({
    selector: "nui-table-column-configuration",
    templateUrl: "./table-column-configuration.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TableColumnConfigurationComponent),
            multi: true,
        },
    ],
})
export class TableColumnConfigurationComponent implements ControlValueAccessor {
    public static lateLoadKey = "TableColumnConfigurationComponent";

    public form: FormGroup;
    public changeFn: Function;

    private destroy$ = new Subject();
    private input: ITableWidgetColumnConfig;

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            description: this.formBuilder.control({}),
            presentation: this.formBuilder.control({}),
        });

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            this.changeFn({
                id: this.input?.id,
                ...value.description,
                formatter: value.presentation,
            });
        });
    }

    public registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    public registerOnTouched(fn: any): void {
    }

    public setDisabledState(isDisabled: boolean): void {
    }

    public writeValue(obj: ITableWidgetColumnConfig): void {
        this.input = obj;

        this.form.setValue({
            presentation: obj?.formatter || {},
            description: obj,
        }, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
