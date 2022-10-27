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

import sum from "lodash/sum";

import {
    IProportionalAggregatorFn,
    IProportionalDonutContentAggregatorProperties,
} from "./types";

export interface IPercentageAggregatorProperties
    extends IProportionalDonutContentAggregatorProperties {
    /** if "true" it'll be 58 not 0.58 */
    base100?: boolean;
}

/**
 * Aggregator for the Proportional Widget with Donut chart type.
 *
 * Receives all the metrics from the donut and gets the active metric percentage.
 */
export const percentageAggregator: IProportionalAggregatorFn = (
    origin,
    properties?: IPercentageAggregatorProperties
) => {
    const data = origin.map((v) => v.data[0]);
    const { activeMetricId, base100 } = properties || {};

    const summed = sum(data);

    let metric = data[0];
    if (activeMetricId) {
        metric = origin.find((entry) => entry.id === activeMetricId)?.data[0];

        if (!metric) {
            console.warn(
                `No metric with id: ${activeMetricId} found. Taking first available.`
            );
        }
    }

    const percentage = metric / summed;

    let finalValue = base100 ? percentage * 100 : percentage;
    // round to 2 digits on fractional part
    finalValue = Math.round(finalValue * 100) / 100;

    return finalValue.toString();
};

percentageAggregator.aggregatorType = "percentageAggregator";
