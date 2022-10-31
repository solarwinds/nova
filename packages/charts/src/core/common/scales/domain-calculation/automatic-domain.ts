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

import indexOf from "lodash/indexOf";

import { IAccessors, IChartSeries } from "../../types";
import { DomainCalculator, IScale } from "../types";
import { mergeDomains } from "./merge-domains";

/** @ignore */
function getFixedDomains(
    chartSeriesSet: IChartSeries<IAccessors>[],
    scaleId: string
): Record<string, IScale<any>[]> {
    return chartSeriesSet.reduce((result, next: IChartSeries<IAccessors>) => {
        for (const scaleKey of Object.keys(next.scales)) {
            if (scaleKey === scaleId) {
                continue;
            }
            const scale = next.scales[scaleKey];
            if (!scale.isDomainFixed) {
                continue;
            }

            if (!result[scaleKey]) {
                result[scaleKey] = [];
            }

            if (indexOf(result[scaleKey], scale) === -1) {
                result[scaleKey].push(scale);
            }
        }

        return result;
    }, <Record<string, IScale<any>[]>>{});
}

/**
 * Returns automatically calculated domain for given scaleKey based on given set of chart series. It considers scales with fixed domains for limiting
 * considered data set.
 *
 * @param {IChartSeries<IAccessors>[]} chartSeriesSet
 * @param {string} scaleKey
 * @param scale
 * @returns {[any, any]} domain
 */
export const getAutomaticDomain: DomainCalculator = (
    chartSeriesSet: IChartSeries<IAccessors>[],
    scaleKey: string,
    scale: IScale<any>
): any[] => {
    const fixedDomains = getFixedDomains(chartSeriesSet, scaleKey);

    const domains: any[][] = chartSeriesSet.map((cs) => {
        // find fixed, continuous scales that are referenced by this series
        const filterScales = Object.keys(fixedDomains).reduce(
            (result, next: string) => {
                const seriesScale = cs.scales[next];
                if (
                    seriesScale &&
                    seriesScale.isContinuous() &&
                    indexOf(fixedDomains[next], seriesScale) !== -1
                ) {
                    result[next] = seriesScale;
                }
                return result;
            },
            <Record<string, IScale<any>>>{}
        );

        return cs.renderer.getDomainOfFilteredData(
            cs,
            filterScales,
            scaleKey,
            cs.scales[scaleKey]
        );
    });

    return mergeDomains(domains, scale);
};

/**
 * Works like getAutomaticDomain, but also includes provided interval in the calculated result
 *
 * @param {[number , number]} interval
 * @returns {(chartSeriesSet: IChartSeries<IAccessors>[], scaleId: string) => [number , number]} A domain calculator
 * that includes the specified interval in its calculation
 */
export const getAutomaticDomainWithIncludedInterval =
    (interval: [number, number]): DomainCalculator =>
    (
        chartSeriesSet: IChartSeries<IAccessors>[],
        scaleId: string,
        scale: IScale<any>
    ) => {
        const automaticDomain = getAutomaticDomain(
            chartSeriesSet,
            scaleId,
            scale
        );

        return [
            Math.min(automaticDomain[0], interval[0]),
            Math.max(automaticDomain[1], interval[1]),
        ];
    };
