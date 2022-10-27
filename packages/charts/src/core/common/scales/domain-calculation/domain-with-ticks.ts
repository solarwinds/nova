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

import { IAxisConfig } from "../../../grid/types";
import { IAccessors, IChartSeries } from "../../types";
import { domain } from "../helpers/domain";
import { DomainCalculator, IDomainWithTicksCalculator, IScale } from "../types";

export const getAutomaticDomainWithTicks = (
    config: IAxisConfig,
    axisGenerator: any,
    domainCalculator: DomainCalculator
): IDomainWithTicksCalculator => {
    const result: IDomainWithTicksCalculator = (
        chartSeriesSet: IChartSeries<IAccessors>[],
        scaleKey: string,
        scale: IScale<any>
    ): any[] => {
        const mergedDomains = domainCalculator(chartSeriesSet, scaleKey, scale);
        const clonedScale = cloneDeep(scale);
        domain(clonedScale, mergedDomains);
        const tickAxis: any = axisGenerator(clonedScale.d3Scale);
        const ticks = tickAxis.scale().ticks(config.approximateTicks);
        if (ticks.length <= 1) {
            return mergedDomains;
        }
        const ticksAverage = ticks[1] - ticks[0];
        if (ticks[0] > mergedDomains[0]) {
            mergedDomains[0] = ticks[0] - ticksAverage;
        }
        if (ticks[ticks.length - 1] < mergedDomains[1]) {
            mergedDomains[1] = ticks[ticks.length - 1] + ticksAverage;
        }
        return mergedDomains;
    };
    result.domainWithTicks = true;
    return result;
};
