import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";
import { transformLoessSmoothing } from "./transformer-loess";
import { transformStandardize } from "./transformer-standardize";

export function transformLoessStandardize(data: ITimeseriesWidgetSeriesData[], hasPercentile?: boolean): ITimeseriesWidgetSeriesData[] {

    let transformed =cloneDeep(data);

    transformed = transformLoessSmoothing(transformed, hasPercentile);
    transformed = transformStandardize(transformed, hasPercentile);

    return transformed;
}
