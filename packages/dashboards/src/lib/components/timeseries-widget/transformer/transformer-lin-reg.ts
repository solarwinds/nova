import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";

export function transformLinReg(data: ITimeseriesWidgetSeriesData[], hasPercentile?: boolean): ITimeseriesWidgetSeriesData[] {
    const transformed = cloneDeep(data);

    const dataValues: {x: any[]; y: any[]} = {
        x: [],
        y: [],
    };

    transformed.forEach((d: ITimeseriesWidgetSeriesData) => {
        dataValues.x.push(d.x.valueOf());
        dataValues.y.push(d.y);
    });

    function linearRegression(xValues: number[], yValues: number[]) {
        let xSum = 0, ySum = 0, xySum = 0, xxSum = 0, count = 0, x = 0, y = 0;

        if (xValues.length !== yValues.length) {
            throw new Error("The x and y data arrays need to be the same length");
        }

        if (xValues.length === 0) {
            throw new Error("There's no data to work with");
        }

        for (let i = 0; i < xValues.length; i++) {
            x = xValues[i];
            y = yValues[i];
            xSum += x;
            ySum += y;
            xxSum += Math.pow(x, 2);
            xySum += x * y;
            count++;
        }

        const m = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
        const b = (ySum / count) - (m * xSum) / count;

        const resultXValues = [];
        const resultYValues = [];

        for (let i = 0; i < xValues.length; i++) {
            x = xValues[i];
            y = x * m + b;
            resultXValues.push(x);
            resultYValues.push(y);
        }

        return resultYValues;
    }

    const linRegData: number[] = linearRegression(dataValues.x, dataValues.y);
    linRegData.forEach((value: number, index: number) => {
        transformed[index].y = value;
    });

    return transformed;
}
