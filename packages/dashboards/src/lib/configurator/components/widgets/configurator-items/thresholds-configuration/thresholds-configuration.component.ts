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
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import includes from "lodash/includes";
import _isNil from "lodash/isNil";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { LoggerService } from "@nova-ui/bits";

import { thresholdsValidator } from "./thresholds-validator";
import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-thresholds-configuration",
    templateUrl: "./thresholds-configuration.component.html",
    styleUrls: ["./thresholds-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ThresholdsConfigurationComponent
    implements OnInit, OnDestroy, OnChanges, IHasChangeDetector, IHasForm
{
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

    private readonly destroy$ = new Subject<void>();

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private logger: LoggerService,
        private cd: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.validateRadioButtonsGroupValue();
        this.form = this.formBuilder.group(
            {
                criticalThresholdValue: [
                    this.criticalThresholdValue || 0,
                    [Validators.required],
                ],
                warningThresholdValue: [this.warningThresholdValue || 0],
                showThresholds: [
                    this.showThresholds || false,
                    [Validators.required],
                ],
                reversedThresholds: [this.reversedThresholds || false],
            },
            {
                validators: thresholdsValidator,
            }
        );

        this.handleWarningThreshold(this.warningThresholdValue);

        this.form.statusChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((change) => {
                this.form.markAllAsTouched();
                this.cd.detectChanges();
            });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
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
            this.handleWarningThreshold(
                changes.warningThresholdValue.currentValue
            );
        }
    }

    public getThresholdsSubtitle(showThreshold: boolean): string {
        return showThreshold
            ? $localize`Custom thresholds`
            : $localize`No thresholds`;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private validateRadioButtonsGroupValue() {
        this.radioButtonGroupValue = this.showThresholds;
    }

    private handleWarningThreshold(value: number | undefined) {
        const warningThresholdFormControl = this.form?.get(
            "warningThresholdValue"
        );
        if (_isNil(value)) {
            warningThresholdFormControl?.setValue(null);
        }
    }
}
