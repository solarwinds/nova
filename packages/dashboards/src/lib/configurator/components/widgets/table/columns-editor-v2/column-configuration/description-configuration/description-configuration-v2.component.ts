import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validators
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ITableWidgetColumnConfig } from "../../../../../../../components/table-widget/types";
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
})
export class DescriptionConfigurationV2Component implements IHasChangeDetector, ControlValueAccessor, OnInit {
    static lateLoadKey = "DescriptionConfigurationV2Component";

    @Input() formControl: AbstractControl;
    @Input() isWidthMessageDisplayed = false;

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

    public validate(c: FormControl): ValidationErrors | null {
        return this.form.valid ? null : { "nestedForm": true };
    }

    public writeValue(obj: ITableWidgetColumnConfig): void {
        this.form.patchValue({
            label: obj.label,
            isActive: obj.isActive,
            width: obj.width,
        }, { emitEvent: false });

        this.changeDetector.markForCheck();
    }

    public ngOnInit(): void {
        const origFunc = this.formControl.markAsTouched;
        this.formControl.markAsTouched = () => {
            // @ts-ignore
            origFunc.apply(this.formControl, arguments);

            this.form.markAllAsTouched();
        };
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public stub() {
        // empty function to hotfix textbox-number behavior (NUI-3442)
    }

    public isWidthMessageDisplayedForThisColumn() {
        const width = this.form.controls["width"].value;
        return this.isWidthMessageDisplayed && typeof width !== "number";
    }

}
