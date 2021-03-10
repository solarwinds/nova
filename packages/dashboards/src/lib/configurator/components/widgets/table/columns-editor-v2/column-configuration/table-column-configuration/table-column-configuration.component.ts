import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from "@angular/forms";
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
})
export class TableColumnConfigurationComponent implements ControlValueAccessor, OnInit {
    public static lateLoadKey = "TableColumnConfigurationComponent";

    public form: FormGroup;
    public changeFn: Function;

    private onDestroy$ = new Subject();
    private input: ITableWidgetColumnConfig;

    @Input() formControl: AbstractControl;
    @Input() isWidthMessageDisplayed = false;

    constructor(private formBuilder: FormBuilder, public changeDetector: ChangeDetectorRef) {
        this.form = this.formBuilder.group({
            description: this.formBuilder.control({}),
            presentation: this.formBuilder.control({}),
        });

        this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((value) => {
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

    public registerOnTouched(fn: any): void {
    }

    public setDisabledState(isDisabled: boolean): void {
    }

    public validate(c: FormControl): ValidationErrors | null {
        return this.form.valid ? null : { "error": "error" };
    }

    public writeValue(obj: ITableWidgetColumnConfig): void {
        this.input = obj;

        this.form.setValue({
            presentation: obj?.formatter || {},
            description: obj,
        }, { emitEvent: false });

        this.changeDetector.markForCheck();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

}
