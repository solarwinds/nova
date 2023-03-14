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

import { UnitOption } from "@nova-ui/bits";

import { ITimeseriesWidgetData } from "./types";

export function metricsSeriesMeasurementsMinMax(
    series: ITimeseriesWidgetData<any>[],
    axisUnits: UnitOption
): { min: number; max: number } {
    if (axisUnits === "percent") {
        return { min: 0, max: 100 };
    }
    // skips percent measurements as they are displayed on the left y-axis and would affect right y-axis domain
    const nonPercentMetrics = series.filter(
        (metric) => metric.metricUnits !== "percent" && metric.data?.length
    );

    // case where there are no measurements for non-percent metrics,  e.g when a license expires
    if (nonPercentMetrics.length === 0) {
        return { min: -1, max: 1 };
    }

    const measurements = nonPercentMetrics.flatMap(m => m.data ?? []);

    return measurements.reduce(
        (acc: { min: number; max: number }, measurement) => ({
            min: Math.min(acc.min, measurement.y),
            max: Math.max(acc.max, measurement.y),
        }),
        { min: measurements[0].y, max: measurements[0].y }
    );
}
