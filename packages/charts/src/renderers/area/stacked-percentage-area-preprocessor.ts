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

import { ChartAssist } from "../../core/chart-assists/chart-assist";
import { IChartAssistSeries, IChartSeries } from "../../core/common/types";
import { IStackMetadata } from "../bar/types";
import { IAreaAccessors } from "./area-accessors";

export function stackedPercentageAreaPreprocessor(
    chartSeriesSet: IChartSeries<IAreaAccessors>[],
    isVisible: (chartSeries: IChartSeries<IAreaAccessors>) => boolean
): IChartSeries<IAreaAccessors>[] {
    // No need to preprocess empty series.
    if (chartSeriesSet.length === 0) {
        return chartSeriesSet;
    }

    const domainValueStacks: Record<any, number> = {};
    const domainValueCombinedTotals: Record<any, number> = {};

    const baseAccessorKey = "x";
    const valueAccessorKey = "y";

    for (const chartSeries of chartSeriesSet) {
        calculateDomainValueCombinedTotals(
            baseAccessorKey,
            valueAccessorKey,
            chartSeries,
            isVisible,
            domainValueCombinedTotals
        );
    }

    for (const chartSeries of chartSeriesSet) {
        applyStackMetadata(
            baseAccessorKey,
            valueAccessorKey,
            chartSeries,
            isVisible,
            domainValueStacks,
            domainValueCombinedTotals
        );
    }

    return chartSeriesSet;
}

export function stackedPercentageArea(
    this: ChartAssist,
    chartSeriesSet: IChartAssistSeries<IAreaAccessors>[]
): IChartAssistSeries<IAreaAccessors>[] {
    return stackedPercentageAreaPreprocessor(
        chartSeriesSet,
        (series: IChartSeries<IAreaAccessors>) =>
            !this.isSeriesHidden(series.id)
    );
}

export function calculateDomainValueCombinedTotals(
    baseAccessorKey: string,
    valueAccessorKey: string,
    chartSeries: IChartSeries<IAreaAccessors>,
    isVisible: any,
    domainValueCombinedTotals: Record<any, number>
) {
    const baseAccessor = chartSeries.accessors.data[baseAccessorKey];
    const accessor0 = chartSeries.accessors.data[valueAccessorKey + "0"];
    const accessor1 = chartSeries.accessors.data[valueAccessorKey + "1"];
    const coef = isVisible(chartSeries) ? 1 : 0;

    chartSeries.data.forEach((datum, index) => {
        // @ts-ignore
        const base = baseAccessor(datum, index, chartSeries.data, chartSeries);
        const value0 = accessor0?.(datum, index, chartSeries.data, chartSeries);
        const value1 = accessor1?.(datum, index, chartSeries.data, chartSeries);

        const diff = (value1 - value0) * coef;
        let total = domainValueCombinedTotals[base.valueOf()];
        // initialize stack
        if (typeof total === "undefined") {
            total = 0;
            domainValueCombinedTotals[base.valueOf()] = total;
        }
        domainValueCombinedTotals[base.valueOf()] = total + diff;
    });
}

export function applyStackMetadata(
    baseAccessorKey: string,
    valueAccessorKey: string,
    chartSeries: IChartSeries<IAreaAccessors>,
    isVisible: any,
    domainValueStacks: Record<any, number>,
    domainValueCombinedTotals: Record<any, number>
) {
    const baseAccessor = chartSeries.accessors.data[baseAccessorKey];
    const accessor0 = chartSeries.accessors.data[valueAccessorKey + "0"];
    const accessor1 = chartSeries.accessors.data[valueAccessorKey + "1"];
    const coef = isVisible(chartSeries) ? 1 : 0;

    chartSeries.data.forEach((datum, index) => {
        // @ts-ignore
        const base = baseAccessor(datum, index, chartSeries.data, chartSeries);
        const value0 = accessor0?.(datum, index, chartSeries.data, chartSeries);
        const value1 = accessor1?.(datum, index, chartSeries.data, chartSeries);

        const diff = (value1 - value0) * coef;
        let start = domainValueStacks[base.valueOf()];
        // initialize stack
        if (typeof start === "undefined") {
            start = 0;
            domainValueStacks[base.valueOf()] = start;
        }
        const diffPercent = diff / domainValueCombinedTotals[base.valueOf()];
        const end = start + diffPercent * 100;
        domainValueStacks[base.valueOf()] = end;

        datum["__stack_" + valueAccessorKey] = { start, end } as IStackMetadata;
    });
}
