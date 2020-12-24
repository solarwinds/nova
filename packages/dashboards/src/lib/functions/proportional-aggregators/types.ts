import { IChartSeries } from "@solarwinds/nova-charts";

export interface IProportionalDonutContentAggregatorProperties {
    /** Metric Id, case sensitive. */
    activeMetricId?: string;
    aggregatorConfig?: Record<string, any>;
}

export interface IProportionalDonutContentAggregator {
    aggregatorType: string;
    properties?: IProportionalDonutContentAggregatorProperties;
}

export interface IProportionalAggregatorOrigin extends Array<Pick<IChartSeries<any>, "id" | "data">> {}

export type IProportionalAggregatorFn = ((origin: IProportionalAggregatorOrigin, metricId?: string, aggregatorConfig?: Record<string, any>) => number) & {
    aggregatorType: string;
};

export interface IProportionalDonutContentAggregatorDefinition {
    aggregatorType: string;
    label: string;
    fn: IProportionalAggregatorFn;
    properties?: IProportionalDonutContentAggregatorProperties;
}
