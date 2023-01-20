import * as d3 from "d3";
import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";
import { transformNormalize } from "./transformer-normalize";

export function transformStandardize(data: ITimeseriesWidgetSeriesData[], hasPercentile?: boolean): ITimeseriesWidgetSeriesData[] {
    let transformed = cloneDeep(data);

    const dataValues: {x: any[]; y: any[]} = {
        x: [],
        y: [],
    };

    transformed.forEach((d: ITimeseriesWidgetSeriesData) => {
        dataValues.x.push(d.x.valueOf());
        dataValues.y.push(d.y);
    });

    const standardizedData: number[] = standardizeData(dataValues.y);
    standardizedData.forEach((value: number, index: number) => {
        transformed[index].y = hasPercentile ? Math.abs(value) : value;
    });
    if (hasPercentile)
    {
        transformed = transformNormalize(transformed);
    }

    function standardizeData(data: any[]) {
        // to standardize array of data --> subtract mean from each value, divide each value by standard devation (except if standard deviation < 1 --> divide by 1)
        const stddev: number = d3.deviation(data) ?? 1;
        return data.map((value: any) => (value - (d3.mean(data) ?? 0)) / (stddev < 1 ? 1 : stddev));
    }

    return transformed;
}
