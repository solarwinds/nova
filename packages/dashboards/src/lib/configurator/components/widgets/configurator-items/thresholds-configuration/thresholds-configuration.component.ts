import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoggerService } from "@nova-ui/bits";
import includes from "lodash/includes";
import _isNil from "lodash/isNil";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IHasChangeDetector, IHasForm } from "../../../../../types";

import { thresholdsValidator } from "./thresholds-validator";

@Component({
    selector: "nui-thresholds-configuration",
    templateUrl: "./thresholds-configuration.component.html",
    styleUrls: ["./thresholds-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThresholdsConfigurationComponent implements OnInit, OnDestroy, OnChanges, IHasChangeDetector, IHasForm {
    public static lateLoadKey = "ThresholdsConfigurationComponent";

    @Input() criticalThresholdValue: number;
    @Input() warningThresholdValue: number;
    @Input() showThresholds: boolean;
    @Input() reversedThresholds: boolean;
    @Output() formReady = new EventEmitter<FormGroup>();

    public thresholdOptions = [
        {
            value: false,
            displayValue: $localize`Never show critical or warning states for this KPI`,
        },
        {
            value: true,
            displayValue: $localize`Set custom thresholds for this widget`,
        },
    ];

    /**
     * this value is added because of the setTimeout in RadioButtonComponent which will be removed in v10 - NUI-4843.
     * when setTimeout is removed this hack can be removed as well
     * @deprecated - remove in scope of NUI-4843
     * */
    public radioButtonGroupValue: boolean;

    public form: FormGroup;

    private destroyed$ = new Subject();

    constructor(public changeDetector: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private logger: LoggerService,
                private cd: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.validateRadioButtonsGroupValue();
        this.form = this.formBuilder.group({
            criticalThresholdValue: [this.criticalThresholdValue || 0, [Validators.required]],
            warningThresholdValue: [this.warningThresholdValue || 0],
            showThresholds: [this.showThresholds || false, [Validators.required]],
            reversedThresholds: [this.reversedThresholds || false],
        }, {
            validators: thresholdsValidator,
        });

        this.handleWarningThreshold(this.warningThresholdValue);

        this.form.statusChanges.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((change) => {
            this.form.markAllAsTouched();
            this.cd.detectChanges();
        });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges) {
        const formKeys = [
            "criticalThresholdValue",
            "warningThresholdValue",
            "showThresholds",
            "reversedThresholds",
        ];

        if (changes) {
            for (const key of Object.keys(changes)) {
                if (includes(formKeys, key)) {
                    const value = changes[key].currentValue;
                    if (value) {
                        this.form?.patchValue({ [key]: value });
                    }
                }
            }

            if (changes.showThresholds) {
                setTimeout(() => this.validateRadioButtonsGroupValue());
            }
        }

        if (changes.warningThresholdValue) {
            this.handleWarningThreshold(changes.warningThresholdValue.currentValue);
        }
    }

    public getThresholdsSubtitle(showThreshold: boolean): string {
        return showThreshold ? $localize`Custom thresholds` : $localize`No thresholds`;
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private validateRadioButtonsGroupValue() {
        this.radioButtonGroupValue = this.showThresholds;
    }

    private handleWarningThreshold(value: number | undefined) {
        const warningThresholdFormControl = this.form?.get("warningThresholdValue");
        if (_isNil(value)) {
            warningThresholdFormControl?.setValue(null);
        }
    }
}
