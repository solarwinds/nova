import get from "lodash/get";

import { IProportionalAggregatorFn, IProportionalDonutContentAggregatorProperties } from "./types";

export interface IFieldMapperAggregatorProperties extends IProportionalDonutContentAggregatorProperties {
    chartSeriesDataFieldId?: string;
}

export const fieldMapper: IProportionalAggregatorFn =
    (origin, properties?: IFieldMapperAggregatorProperties) => {
        const chartSeriesDataFieldId = properties?.chartSeriesDataFieldId || "data[0]";

        let metric: any = origin[0];
        if (properties?.activeMetricId) {
            metric = origin.find(entry => entry.id === properties?.activeMetricId);

            if (!metric) {
                console.warn(`No metric with id: ${properties?.activeMetricId} found. Taking first available.`);
            }
        }

        return get(metric, chartSeriesDataFieldId);

    };

fieldMapper.aggregatorType = "fieldMapper";
