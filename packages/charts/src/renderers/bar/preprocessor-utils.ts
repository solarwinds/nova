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

import unionBy from "lodash/unionBy";

import { IChartSeries } from "../../core/common/types";
import { IBarAccessors } from "./accessors/bar-accessors";

/** @ignore */
export function gatherCategories(
    chartSeriesSet: IChartSeries<IBarAccessors>[],
    type: string = "category"
): string[] {
    return chartSeriesSet.reduce((acc: any[], chartSeries) => {
        const categoryAccessor = chartSeries.accessors.data[type];
        const categories = chartSeries.data.reduce(
            (accInner: string[], datum, index: number) => {
                accInner.push(
                    categoryAccessor?.(
                        datum,
                        index,
                        chartSeries.data,
                        chartSeries
                    )
                );
                return accInner;
            },
            []
        );
        return unionBy(acc, categories, (d) => d.valueOf());
    }, []);
}
