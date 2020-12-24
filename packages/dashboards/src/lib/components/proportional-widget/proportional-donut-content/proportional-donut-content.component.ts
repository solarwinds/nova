import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { LoggerService } from "@solarwinds/nova-bits";
import { ChartAssist, IAccessors, IChartAssistEvent, IChartAssistSeries } from "@solarwinds/nova-charts";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { mapDataToFormatterProperties } from "../../../functions/map-data-to-formatter-properties";
import { IProportionalDonutContentAggregator, IProportionalDonutContentAggregatorDefinition, IProportionalDonutContentAggregatorProperties } from "../../../functions/proportional-aggregators/types";
import { ProportionalContentAggregatorsRegistryService } from "../../../services/proportional-content-aggregators-registry.service";
import { ProportionalDonutContentFormattersRegistryService } from "../../../services/public-api";
import { IHasChangeDetector } from "../../../types";
import { IFormatter, IFormatterDefinition, IFormatterProperties } from "../../types";
import { IDonutContentConfig } from "../types";

@Component({
    selector: "nui-proportional-donut-content",
    templateUrl: "./proportional-donut-content.component.html",
    styleUrls: ["./proportional-donut-content.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProportionalDonutContentComponent implements OnInit, OnChanges, OnDestroy, IHasChangeDetector {
    static lateLoadKey = "ProportionalDonutContentComponent";

    @Input() public widgetData: IChartAssistSeries<IAccessors>[];
    @Input() public donutConfig: IDonutContentConfig;

    @Input() private chartAssist: ChartAssist;

    public aggregatedValue: string;
    public contentFormatter: IFormatter;
    public contentFormatterProperties: IFormatterProperties | undefined;

    private contentFormatterDefinition: IFormatterDefinition;
    private contentAggregatorDefinition: IProportionalDonutContentAggregatorDefinition;
    /** Hovered series Id */
    private emphasizedSeriesId: string;
    private destroy$: Subject<unknown> = new Subject();

    constructor(
        private aggregatorRegistry: ProportionalContentAggregatorsRegistryService,
        private formatterRegistry: ProportionalDonutContentFormattersRegistryService,
        public changeDetector: ChangeDetectorRef,
        private logger: LoggerService
    ) { }

    ngOnInit(): void {
        this.chartAssist?.chartAssistSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: IChartAssistEvent) => {
                this.emphasizedSeriesId = data.payload?.seriesId;
                this.updateAggregatedValue();
                this.updateFormatterProperties();
                this.changeDetector.detectChanges();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.donutConfig) {
            const donutConfig: IDonutContentConfig = changes.donutConfig.currentValue;

            const { formatter, aggregator } = donutConfig;
            if (aggregator) {
                this.updateAggregatorDefinition(aggregator);
                this.updateAggregatedValue();
            }

            if (formatter) {
                this.contentFormatter = formatter;
                this.updateFormatterDefinition(formatter);
                this.updateFormatterProperties();
            }
        }

        if (changes.widgetData) {
            this.updateAggregatedValue();
            this.updateFormatterProperties();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Iterates over formatters and maps their properties from the data
     *
     * @param formattersConfiguration
     */
    private getFormatterProperties(formatter: IFormatter | undefined) {
        if (!formatter) { return undefined; }

        return {
            ...this.contentFormatterDefinition?.properties,
            data: mapDataToFormatterProperties(formatter, {
                // add "aggregatedValue" as "value" so that formatter processes it by default
                "value": this.aggregatedValue,
            }),
        };
    }

    private updateAggregatorDefinition(aggregatorConfig: IProportionalDonutContentAggregator) {
        const fromRegistry = this.aggregatorRegistry.getItem(aggregatorConfig.aggregatorType);

        if (fromRegistry) {
            this.contentAggregatorDefinition = fromRegistry;
        } else {
            this.logger.warn(`No aggregator with key ${aggregatorConfig.aggregatorType} found in registry.`);
        }
    }

    private updateFormatterDefinition(formatterConfig: IFormatter) {
        const fromRegistry = this.formatterRegistry.getItem(formatterConfig.componentType);

        if (fromRegistry) {
            this.contentFormatterDefinition = fromRegistry;
        } else {
            this.logger.warn(`No aggregator with key ${formatterConfig.componentType} found in registry.`);
        }
    }

    private updateAggregatedValue(): void {
        if (!this.widgetData || !this.contentAggregatorDefinition) {
            this.logger.warn(`Can't aggregate value. Aggregator key: ${this.contentAggregatorDefinition?.aggregatorType}. Data: ${this.widgetData}`);
            return;
        }

        const { activeMetricId, aggregatorConfig } = this.getAggregatorProperties();

        this.aggregatedValue = this.contentAggregatorDefinition.fn(
            this.widgetData,
            // prioritize emphasizedSeriesId if series is hovered on the chart
            this.emphasizedSeriesId || activeMetricId,
            aggregatorConfig
        ).toString();
    }

    private updateFormatterProperties() {
        this.contentFormatterProperties = this.getFormatterProperties(this.contentFormatter);
    }

    private getAggregatorProperties(): IProportionalDonutContentAggregatorProperties {
        return {
            ...this.contentAggregatorDefinition?.properties,
            ...this.donutConfig?.aggregator?.properties,
        };
    }
}
