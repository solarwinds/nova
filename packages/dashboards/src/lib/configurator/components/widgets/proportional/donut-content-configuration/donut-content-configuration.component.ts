import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventBus, IDataField, IDataSource, IEvent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ProportionalWidgetChartTypes } from "../../../../../components/proportional-widget/types";
import { IFormatter, IFormatterConfigurator, IFormatterDefinition } from "../../../../../components/types";
import { IProportionalDonutContentAggregator, IProportionalDonutContentAggregatorDefinition } from "../../../../../functions/proportional-aggregators/types";
import { ProportionalContentAggregatorsRegistryService } from "../../../../../services/proportional-content-aggregators-registry.service";
import { ProportionalDonutContentFormattersRegistryService } from "../../../../../services/table-formatter-registry.service";
import { IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { DATA_SOURCE_CREATED } from "../../../../types";
import { IAggregatorConfiguratorProperties } from "../aggregators-configurators/aggregator-configurator/aggregator-configurator.component";

@Component({
    selector: "nui-donut-content-configuration",
    templateUrl: "./donut-content-configuration.component.html",
    styleUrls: ["./donut-content-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutContentConfigurationComponent implements OnInit, OnChanges, IHasChangeDetector, OnDestroy {
    static lateLoadKey = "DonutContentConfigurationComponent";

    @Input() public chartType: ProportionalWidgetChartTypes;
    @Input() public formatter: IFormatter;
    @Input() public aggregator: IProportionalDonutContentAggregator;

    @Output() public formReady = new EventEmitter();

    public shown: boolean = true;
    public form = this.formBuilder.group({
        formatter: this.formBuilder.group({
            componentType: [undefined],
            properties: [],
        }),
        aggregator: this.formBuilder.group({
            aggregatorType: [undefined],
            properties: [],
        }),
    });
    public formatters: IFormatterDefinition[];
    public aggregators: IProportionalDonutContentAggregatorDefinition[];
    public dataFields: IDataField[] = [];

    public currentFormatterDefinition: IFormatterDefinition | undefined;
    public formatterConfiguratorProps: IFormatterConfigurator;

    public currentAggregatorDefinition: IProportionalDonutContentAggregatorDefinition | undefined;
    public aggregatorConfiguratorProps: IAggregatorConfiguratorProperties;

    private destroy$ = new Subject();

    constructor(private formBuilder: FormBuilder,
        public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        private contentFormattersRegistry: ProportionalDonutContentFormattersRegistryService,
        private aggregatorRegistry: ProportionalContentAggregatorsRegistryService
        ) { }

    public ngOnInit(): void {
        this.watchFormChanges();
        this.setFromRegistry();

        this.eventBus.getStream(DATA_SOURCE_CREATED)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IEvent<IDataSource>) => {
                const dataSource = event.payload;
                if (dataSource) {
                    dataSource.dataFieldsConfig?.dataFields$
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((dataFields) => {
                            this.dataFields = dataFields;
                            this.updateAggregatorConfiguratorProps();
                        });
                }
            });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.formatter) {
            this.form.get("formatter")?.patchValue({
                ...changes.formatter.currentValue,
            });
        }

        if (changes.aggregator) {
            this.form.get("aggregator")?.patchValue({
                ...changes.aggregator.currentValue,
            });
        }

        if (changes.chartType) {
            const chartType = changes.chartType.currentValue;
            this.shown = chartType === ProportionalWidgetChartTypes.DonutChart;
        }
    }

    public ngOnDestroy() {
        this.destroy$.complete();
    }

    public onFormReady(formControlName: string, form: FormGroup) {
        (<FormGroup>this.form.get(formControlName)).setControl("properties", form);
    }

    public get subtitleText() {
        return `${this.currentAggregatorDefinition?.label}, ${this.currentFormatterDefinition?.label}`;
    }

    private setFromRegistry() {
        this.formatters = this.contentFormattersRegistry.getItems();
        this.aggregators = this.aggregatorRegistry.getItems();

        let formatterToSet = this.formatters.find((formatter) => formatter.componentType === this.formatter?.componentType);
        if (!formatterToSet) {
            formatterToSet = this.formatters[0];
        }
        this.form.get("formatter.componentType")?.setValue(formatterToSet.componentType);

        let aggregatorToSet = this.aggregators.find((aggregator) => aggregator.aggregatorType === this.aggregator?.aggregatorType);
        if (!aggregatorToSet) {
            aggregatorToSet = this.aggregators[0];
        }
        this.form.get("aggregator.aggregatorType")?.setValue(aggregatorToSet.aggregatorType);
    }

    private watchFormChanges() {
        this.form.get("aggregator.aggregatorType")?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((aggregatorType: string) => {
                this.currentAggregatorDefinition = this.aggregators
                    .find((f) => f.aggregatorType === aggregatorType) as IProportionalDonutContentAggregatorDefinition;
                this.updateAggregatorConfiguratorProps();
            });

        this.form.get("formatter.componentType")?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((componentType: string) => {
                this.currentFormatterDefinition = this.formatters
                    .find((f) => f.componentType === componentType) as IFormatterDefinition;
                this.updateAggregatorConfiguratorProps();
            });
    }

    private updateAggregatorConfiguratorProps() {
        this.aggregatorConfiguratorProps = {
            ...this.currentAggregatorDefinition?.properties,
            ...this.aggregator?.properties,
            metrics: this.dataFields,
        };
    }
}
