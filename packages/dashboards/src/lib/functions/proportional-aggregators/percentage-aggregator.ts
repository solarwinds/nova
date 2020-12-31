import sum from "lodash/sum";

import { IProportionalAggregatorFn, IProportionalDonutContentAggregatorProperties } from "./types";

export interface IPercentageAggregatorProperties extends IProportionalDonutContentAggregatorProperties {
    /** if "true" it'll be 58 not 0.58 */
    base100?: boolean;
}

/**
 * Aggregator for the Proportional Widget with Donut chart type.
 *
 * Receives all the metrics from the donut and gets the active metric percentage.
 */
export const percentageAggregator: IProportionalAggregatorFn = (origin, properties?: IPercentageAggregatorProperties) => {
    const data = origin.map(v => v.data[0]);
    const { activeMetricId, base100 } = properties || {};

    const summed = sum(data);

    let metric = data[0];
    if (activeMetricId) {
        metric = origin.find(entry => entry.id === activeMetricId)?.data[0];

        if (!metric) {
            console.warn(`No metric with id: ${activeMetricId} found. Taking first available.`);
        }
    }

    const percentage = metric / summed;

    let finalValue = base100
        ? percentage * 100
        : percentage;
    // round to 2 digits on fractional part
    finalValue = Math.round(finalValue * 100) / 100;

    return finalValue.toString();
};

percentageAggregator.aggregatorType = "percentageAggregator";
