import defaultsDeep from "lodash/defaultsDeep";
import sum from "lodash/sum";

import { IProportionalAggregatorFn } from "./types";

export interface IPercentageAggregatorConfig {
    /** if "true" it'll be 58 not 0.58 */
    base100?: boolean;
}

export const percentageAggregator: IProportionalAggregatorFn = (origin, metricId?, config?) => {
    const data = origin.map(v => v.data[0]);

    const summed = sum(data);

    let metric;
    if (metricId) {
        metric = origin.find(entry => entry.id === metricId)?.data[0];
    }
    if (!metric) {
        console.warn(`No metric with id: ${metricId} found. Taking first available.`);
        metric = data[0];
    }

    const percentage = metric / summed;

    let finalValue = config?.base100
        ? percentage * 100
        : percentage;
    // round to 2 digits on fractional part
    finalValue = Math.round(finalValue * 100) / 100;

    return finalValue;
};

percentageAggregator.aggregatorType = "Percentage";
