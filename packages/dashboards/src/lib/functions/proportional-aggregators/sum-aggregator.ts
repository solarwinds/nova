import sum from "lodash/sum";

import { IProportionalAggregatorFn } from "./types";

/**
 * Receives all the metrics from the donut and gets their sum.
 */
export const sumAggregator: IProportionalAggregatorFn =
    (origin, properties?) => {
        const { activeMetricId } = properties || {};

        if (activeMetricId) {
            const activeMetric = origin.find(entry => entry.id === activeMetricId);
            if (activeMetric) {
                return activeMetric.data[0];
            }
        }

        return sum(origin.map(entry => entry.data[0])).toString();
    };

sumAggregator.aggregatorType = "sumAggregator";
