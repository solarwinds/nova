import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IDataField, LoggerService, SelectV2Component } from "@solarwinds/nova-bits";

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
})
export class AggregatorMetricSelectorConfigurationComponent implements OnInit, OnChanges, IHasChangeDetector {
    static lateLoadKey = "AggregatorMetricSelectorConfigurationComponent";

    @Input() public metrics: IDataField[];
    @Input() public activeMetricId: string;

    @Output() public formReady = new EventEmitter();

    public form: FormGroup = this.formBuilder.group({
        activeMetricId: [],
    });

    @ViewChild("metricsSelect")
    public meticsSelect: SelectV2Component;

    constructor(public changeDetector: ChangeDetectorRef,
        protected formBuilder: FormBuilder,
        protected logger: LoggerService
        ) { }

    ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.activeMetricId) {
            this.form.get("activeMetricId")?.setValue(changes.activeMetricId.currentValue);

            const currentMetricConfig = this.metrics.find(m => m.id === changes.activeMetricId.currentValue);
            if (!currentMetricConfig) {
                this.logger.warn(`AggregatorMetricSelectorConfigurationComponent: No metric found for id: ${changes.activeMetricId.currentValue}`);
            }
        }
    }

    unsetMetric() {
        this.form.controls["activeMetricId"].reset();
        this.meticsSelect.hideDropdown();
    }

}
