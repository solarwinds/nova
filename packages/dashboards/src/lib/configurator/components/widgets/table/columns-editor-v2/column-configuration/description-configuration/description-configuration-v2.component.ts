import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ITableWidgetColumnConfig } from "../../../../../../../components/table-widget/types";
import { IHasChangeDetector } from "../../../../../../../types";

@Component({
    selector: "nui-table-column-description-configuration-v2",
    templateUrl: "./description-configuration-v2.component.html",
    styleUrls: ["./description-configuration-v2.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DescriptionConfigurationV2Component),
            multi: true,
        },
    ],
})
export class DescriptionConfigurationV2Component implements IHasChangeDetector, ControlValueAccessor {
    static lateLoadKey = "DescriptionConfigurationV2Component";

    public form: FormGroup;
    public changeFn: Function;

    private destroy$ = new Subject();

    constructor(private formBuilder: FormBuilder, public changeDetector: ChangeDetectorRef) {
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

    public registerOnTouched(fn: any): void {
    }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    public writeValue(obj: ITableWidgetColumnConfig): void {
        this.form.patchValue({
            label: obj.label,
            isActive: obj.isActive,
            width: obj.width,
        }, { emitEvent: false });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
