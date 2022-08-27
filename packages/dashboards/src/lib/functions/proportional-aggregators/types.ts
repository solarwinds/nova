import { IChartSeries } from "@nova-ui/charts";

export interface IProportionalDonutContentAggregatorProperties {
    /** Metric Id, case sensitive. */
    activeMetricId?: string;
    [key: string]: any;
}

export interface IProportionalDonutContentAggregator {
    aggregatorType: string;
    properties?: IProportionalDonutContentAggregatorProperties;
}

interface IAggregatorChartData extends Pick<IChartSeries<any>, "id" | "data"> {
    // there's a possibility to pass any value from the dataSource to the aggregator
    [key: string]: any;
}
export interface IProportionalAggregatorOrigin
    extends Array<IAggregatorChartData> {}

export type IProportionalAggregatorFn = ((
    origin: IProportionalAggregatorOrigin,
    properties?: IProportionalDonutContentAggregatorProperties
) => string) & {
    aggregatorType: string;
};

export interface IProportionalDonutContentAggregatorDefinition {
    aggregatorType: string;
    label: string;
    fn: IProportionalAggregatorFn;
    properties?: IProportionalDonutContentAggregatorProperties;
    configurationComponent?: string;
}
