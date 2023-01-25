import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";

export function transformNormalize(
    data: ITimeseriesWidgetSeriesData[],
    hasPercentile?: boolean
): ITimeseriesWidgetSeriesData[] {
    const transformed = cloneDeep(data);

    const dataValues: { x: any[]; y: any[] } = {
        x: [],
        y: [],
    };

    transformed.forEach((d: ITimeseriesWidgetSeriesData) => {
        dataValues.x.push(d.x.valueOf());
        dataValues.y.push(d.y);
    });

    const normalizedData: number[] = normalize(dataValues.y);
    normalizedData.forEach((value: number, index: number) => {
        transformed[index].y = value * 100.0;
    });

    function normalize(values: number[]) {
        // find max and min
        const max = Math.max(...values);
        const min = Math.min(...values);

        // if max = min --> return every value = 0
        // else  --> return normalized data values
        return max === min
            ? values.map((value: number) => 0)
            : values.map((value: number) => (value - min) / (max - min));
    }

    return transformed;
}
