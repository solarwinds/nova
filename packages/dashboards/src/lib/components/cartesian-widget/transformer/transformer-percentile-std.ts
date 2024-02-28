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

import * as d3 from "d3";
import cloneDeep from "lodash/cloneDeep";

import { CartesianWidgetSeriesData } from "../types";
import { transformNormalize } from "./transformer-normalize";

export function transformPercentileStd(
    data: CartesianWidgetSeriesData[],
    hasPercentile?: boolean
): CartesianWidgetSeriesData[] {
    let transformed = cloneDeep(data);

    const dataValues: { x: any[]; y: any[] } = {
        x: [],
        y: [],
    };

    transformed.forEach((d: CartesianWidgetSeriesData) => {
        dataValues.x.push(d.x.valueOf());
        dataValues.y.push(d.y);
    });

    function percentileStandardizeData(data: number[]) {
        const median: number = d3.median(data) ?? 0;
        const medianAbsoluteDeviation: number = getMedianAbsoluteDeviation(
            data,
            median
        );
        // formula to transform data (percentile deviation)
        return data.map(
            (value: number) => (value - median) / medianAbsoluteDeviation
        );
    }

    function getMedianAbsoluteDeviation(values: number[], median: number) {
        const absoluteValueOfMinusMedian: number[] = values.map(
            (value: number) => Math.abs(value - median)
        );
        let medianAbsoluteDeviation: number =
            d3.median(absoluteValueOfMinusMedian) ?? 0;
        // median absolute deviation
        // If the MAD is less than one then just set it to one in order to just show raw difference from the median
        if (medianAbsoluteDeviation < 1.0) {
            medianAbsoluteDeviation = 1.0;
        }
        return medianAbsoluteDeviation;
    }

    const percentileStandardizedData: number[] = percentileStandardizeData(
        dataValues.y
    );
    percentileStandardizedData.forEach((value: number, index: number) => {
        transformed[index].y = hasPercentile ? Math.abs(value) : value;
    });
    if (hasPercentile) {
        transformed = transformNormalize(transformed, hasPercentile);
    }

    return transformed;
}
