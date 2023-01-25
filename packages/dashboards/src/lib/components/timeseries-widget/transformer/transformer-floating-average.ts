import cloneDeep from "lodash/cloneDeep";
import moment from "moment/moment";

import { ITimeseriesWidgetSeriesData } from "../types";

export function transformFloatingAverage(
    data: ITimeseriesWidgetSeriesData[],
    hasPercentile?: boolean
): ITimeseriesWidgetSeriesData[] {
    const transformed = cloneDeep(data);

    function getAverageFromLastHour(
        data: ITimeseriesWidgetSeriesData[],
        index: number
    ) {
        let sum = 0.0;
        let count = 0;

        const dateTime = moment(data[index].x);
        while (
            index >= 0 &&
            dateTime.diff(moment(data[index].x), "minutes") <= 60
        ) {
            count++;
            sum += data[index].y;
            index--;
        }
        return sum / count;
    }

    transformed.forEach((value: ITimeseriesWidgetSeriesData, index: number) => {
        transformed[index].y = getAverageFromLastHour(transformed, index);
    });

    return transformed;
}
