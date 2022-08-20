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
import {
    EventBus,
    IDataField,
    IDataSource,
    IEvent,
    LoggerService,
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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

    private destroy$ = new Subject();

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

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);

        if (changes.chartSeriesDataFieldId) {
            this.form
                .get("chartSeriesDataFieldId")
                ?.setValue(changes.chartSeriesDataFieldId.currentValue);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
