import * as d3 from "d3";
import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";
import { transformNormalize } from "./transformer-normalize";

export function transformPercentileStd(data: ITimeseriesWidgetSeriesData[], hasPercentile?: boolean): ITimeseriesWidgetSeriesData[] {
    let transformed = cloneDeep(data);

    const dataValues: {x: any[]; y: any[]} = {
        x: [],
        y: [],
    };

    transformed.forEach((d: ITimeseriesWidgetSeriesData) => {
        dataValues.x.push(d.x.valueOf());
        dataValues.y.push(d.y);
    });

    function percentileStandardizeData(data: number[]) {
        const median: number = d3.median(data) ?? 0;
        const medianAbsoluteDeviation: number = getMedianAbsoluteDeviation(data, median);
        // formula to transform data (percentile deviation)
        return data.map((value: number) => (value - median) / medianAbsoluteDeviation);
    }

    function getMedianAbsoluteDeviation(values: number[], median: number) {
        const absoluteValueOfMinusMedian: number[] = values.map((value: number) => Math.abs(value - median));
        let medianAbsoluteDeviation: number = d3.median(absoluteValueOfMinusMedian) ?? 0;
        // median absolute deviation
        // If the MAD is less than one then just set it to one in order to just show raw difference from the median
        if (medianAbsoluteDeviation < 1.0) {
            medianAbsoluteDeviation = 1.0;
        }
        return medianAbsoluteDeviation;
    }

    const percentileStandardizedData: number[] = percentileStandardizeData(dataValues.y);
    percentileStandardizedData.forEach((value: number, index: number) => {
        transformed[index].y = hasPercentile ? Math.abs(value) : value;
    });
    if (hasPercentile)
    {
        transformed = transformNormalize(transformed, hasPercentile);
    }

    return transformed;
}
