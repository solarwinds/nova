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
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { IDataField, LoggerService, SelectV2Component } from "@nova-ui/bits";

import { IHasChangeDetector } from "../../../../../../types";

export interface IAggregatorConfiguratorProperties {
    metrics: IDataField[];
    activeMetricId?: string;
    [key: string]: any;
}

@Component({
    selector: "nui-aggregator-configurator",
    templateUrl: "./aggregator-configurator.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class AggregatorMetricSelectorConfigurationComponent
    implements OnInit, OnChanges, IHasChangeDetector
{
    static lateLoadKey = "AggregatorMetricSelectorConfigurationComponent";

    @Input() public metrics: IDataField[];
    @Input() public activeMetricId: string;

    @Output() public formReady = new EventEmitter();

    public form: FormGroup = this.formBuilder.group({
        activeMetricId: [],
    });

    @ViewChild("metricsSelect")
    public meticsSelect: SelectV2Component;

    constructor(
        public changeDetector: ChangeDetectorRef,
        protected formBuilder: FormBuilder,
        protected logger: LoggerService
    ) {}

    public ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.activeMetricId) {
            this.form
                .get("activeMetricId")
                ?.setValue(changes.activeMetricId.currentValue);

            const currentMetricConfig = this.metrics.find(
                (m) => m.id === changes.activeMetricId.currentValue
            );
            if (!currentMetricConfig) {
                this.logger.warn(
                    `AggregatorMetricSelectorConfigurationComponent: No metric found for id: ${changes.activeMetricId.currentValue}`
                );
            }
        }
    }

    public unsetMetric(): void {
        this.form.controls["activeMetricId"].reset();
        this.meticsSelect.hideDropdown();
    }
}
