import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";
import { loess } from "./loess";

export function transformLoessSmoothing(
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

    const smoothedData: number[] = loess().bandwidth(0.1)(
        dataValues.x,
        dataValues.y
    );
    smoothedData.forEach((value: number, index: number) => {
        transformed[index].y = value;
    });

    return transformed;
}
