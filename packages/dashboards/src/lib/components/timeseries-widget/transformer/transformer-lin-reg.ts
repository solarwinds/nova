// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";

export function transformLinReg(
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

    function linearRegression(xValues: number[], yValues: number[]) {
        let xSum = 0,
            ySum = 0,
            xySum = 0,
            xxSum = 0,
            count = 0,
            x = 0,
            y = 0;

        if (xValues.length !== yValues.length) {
            throw new Error(
                "The x and y data arrays need to be the same length"
            );
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
        const b = ySum / count - (m * xSum) / count;

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
