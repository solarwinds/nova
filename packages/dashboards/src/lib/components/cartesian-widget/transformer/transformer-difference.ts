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

import { CartesianWidgetSeriesData } from "../types";

export function transformDifference(
    data: CartesianWidgetSeriesData[],
    hasPercentile?: boolean
): CartesianWidgetSeriesData[] {
    const transformed = cloneDeep(data);
    const n = data.length;

    const dataValues: { x: any[]; y: any[] } = {
        x: [],
        y: [],
    };

    transformed.forEach((d: CartesianWidgetSeriesData) => {
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
