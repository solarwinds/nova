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
