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

import isUndefined from "lodash/isUndefined";

import { ChartAssist } from "../../core/chart-assists/chart-assist";
import { IChartAssistSeries, IChartSeries } from "../../core/common/types";
import { IBarAccessors } from "./accessors/bar-accessors";
import { gatherCategories } from "./preprocessor-utils";

export function stackedPreprocessor(
    chartSeriesSet: IChartSeries<IBarAccessors>[],
    isVisible: (chartSeries: IChartSeries<IBarAccessors>) => boolean
): IChartSeries<IBarAccessors>[] {
    // No need to preprocess empty series.
    if (chartSeriesSet.length === 0) {
        return chartSeriesSet;
    }
    const categories = gatherCategories(
        chartSeriesSet.filter(
            (chartSeries) =>
                isUndefined(chartSeries.preprocess) || chartSeries.preprocess
        )
    );

    // This is adding metadata to the dataset and filling missing
    chartSeriesSet.reduce((acc: number[], chartSeries) => {
        if (!isUndefined(chartSeries.preprocess) && !chartSeries.preprocess) {
            return acc;
        }

        const categoryAccessor = chartSeries.accessors.data["category"];
        const valueAccessor = chartSeries.accessors.data["value"];

        if (!valueAccessor) {
            throw new Error("valueAccessor is not defined");
        }
        // index makes algorithm faster
        const dataIndex = chartSeries.data.reduce(
            (accInner: any, next: any, i: number) => ({
                ...accInner,
                [categoryAccessor(next, i, chartSeries.data, chartSeries)]: i,
            }),
            {}
        );
        const reorderedData: any[] = [];

        categories.forEach((category: string, i) => {
            let datum: any;
            if (dataIndex[category] !== undefined) {
                datum = chartSeries.data[dataIndex[category]];
                const metadata: any = {};
                const coef = isVisible(chartSeries) ? 1 : 0;
                metadata.start = acc[i];
                acc[i] +=
                    (valueAccessor(
                        datum,
                        dataIndex[category],
                        chartSeries.data,
                        chartSeries
                    ) || 0) * coef;
                metadata.end = acc[i];
                datum["__bar"] = metadata;
                reorderedData.push(datum);
            }
        });

        chartSeries.data = reorderedData;
        return acc;
    }, Array(categories.length).fill(0));

    return chartSeriesSet;
}

export function stack(
    this: ChartAssist,
    chartSeriesSet: IChartAssistSeries<IBarAccessors>[]
): IChartAssistSeries<IBarAccessors>[] {
    return stackedPreprocessor(
        chartSeriesSet,
        (series: IChartSeries<IBarAccessors>) => !this.isSeriesHidden(series.id)
    );
}
