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
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    EventBus,
    IDataField,
    IDataSource,
    IEvent,
    LoggerService,
} from "@nova-ui/bits";

import { IProportionalDataFieldsConfig } from "../../../../../../components/proportional-widget/types";
import {
    IHasChangeDetector,
    PIZZAGNA_EVENT_BUS,
} from "../../../../../../types";
import { DATA_SOURCE_CREATED } from "../../../../../types";
import { AggregatorMetricSelectorConfigurationComponent } from "../aggregator-configurator/aggregator-configurator.component";

const DEFAULT_CHART_SERIES_DATA_FIELD: IDataField = {
    id: "data[0]",
    label: "data",
    // @ts-ignore
    dataType: null,
};

@Component({
    selector: "nui-field-mapper-aggregator-configurator",
    templateUrl: "./field-mapper-aggregator-configurator.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FieldMapperAggregatorConfiguratorComponent
    extends AggregatorMetricSelectorConfigurationComponent
    implements OnInit, OnChanges, OnDestroy, IHasChangeDetector
{
    static lateLoadKey = "FieldMapperAggregatorConfiguratorComponent";

    @Input() chartSeriesDataFieldId: string;

    public chartSeriesDataFields: IDataField[] = [
        DEFAULT_CHART_SERIES_DATA_FIELD,
    ];
    public form: FormGroup = this.formBuilder.group({
        activeMetricId: [],
        chartSeriesDataFieldId: [],
    });

    private readonly destroy$ = new Subject<void>();

    constructor(
        changeDetector: ChangeDetectorRef,
        formBuilder: FormBuilder,
        logger: LoggerService,
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>
    ) {
        super(changeDetector, formBuilder, logger);

        this.eventBus
            .getStream(DATA_SOURCE_CREATED)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IEvent<IDataSource>) => {
                const dataSource = event.payload;
                if (dataSource) {
                    (<IProportionalDataFieldsConfig>(
                        dataSource.dataFieldsConfig
                    ))?.chartSeriesDataFields$
                        ?.pipe(takeUntil(this.destroy$))
                        .subscribe(
                            (dataFields) =>
                                (this.chartSeriesDataFields = dataFields)
                        );
                }
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);

        if (changes.chartSeriesDataFieldId) {
            this.form
                .get("chartSeriesDataFieldId")
                ?.setValue(changes.chartSeriesDataFieldId.currentValue);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
