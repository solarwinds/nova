import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";

export function transformDifference(
    data: ITimeseriesWidgetSeriesData[],
    hasPercentile?: boolean
): ITimeseriesWidgetSeriesData[] {
    const transformed = cloneDeep(data);
    const n = data.length;

    const dataValues: { x: any[]; y: any[] } = {
        x: [],
        y: [],
    };

    transformed.forEach((d: ITimeseriesWidgetSeriesData) => {
        dataValues.x.push(d.x.valueOf());
        dataValues.y.push(d.y);
    });

    function differenceData(data: number[]) {
        const newData: number[] = [];
        let currentYvalue: number;
        let previousYvalue: number;
        let answer: number = 0;

        for (let i = 0; i < n; i++) {
            if (i === n - 1) {
                newData.push(answer);
                break;
            }
            currentYvalue = data[i + 1];
            previousYvalue = data[i];
            answer = currentYvalue - previousYvalue;
            if (hasPercentile) {
                answer = Math.abs(answer);
            }
            newData.push(answer);
        }
        return newData;
    }

    const differencedData: number[] = differenceData(dataValues.y);
    differencedData.forEach((value: number, index: number) => {
        transformed[index].y = value;
    });

    return transformed;
}
