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

import get from "lodash/get";

import {
    IProportionalAggregatorFn,
    IProportionalAggregatorOrigin,
    IProportionalDonutContentAggregatorProperties,
} from "./types";

export interface IFieldMapperAggregatorProperties
    extends IProportionalDonutContentAggregatorProperties {
    chartSeriesDataFieldId?: string;
}

export const fieldMapper: IProportionalAggregatorFn = (
    origin: IProportionalAggregatorOrigin,
    properties?: IFieldMapperAggregatorProperties
): any => {
    const chartSeriesDataFieldId =
        properties?.chartSeriesDataFieldId || "data[0]";

    let metric: any = origin[0];
    if (properties?.activeMetricId) {
        metric = origin.find(
            (entry) => entry.id === properties?.activeMetricId
        );

        if (!metric) {
            console.warn(
                `No metric with id: ${properties?.activeMetricId} found. Taking first available.`
            );
        }
    }

    return get(metric, chartSeriesDataFieldId);
};

fieldMapper.aggregatorType = "fieldMapper";
