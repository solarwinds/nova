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

import { pie } from "d3-shape";

import { IRadialAccessors } from "./accessors/radial-accessors";
import { ChartAssist } from "../../core/chart-assists/chart-assist";
import { IChartAssistSeries, IChartSeries } from "../../core/common/types";

/**
 * Pre-processing function for Pie and Donut chart renderers.
 *
 * @param {IChartSeries<IAccessors>[]} seriesSet incoming data series set
 * @param {(series: IChartSeries<IAccessors>) => boolean} isVisible visibility accessor function
 * @returns {IChartSeries<IAccessors>[]}
 */
export function radialPreprocessor(
    seriesSet: IChartSeries<IRadialAccessors>[],
    isVisible: (series: IChartSeries<IRadialAccessors>) => boolean
): IChartSeries<IRadialAccessors>[] {
    if (!seriesSet[0]) {
        return seriesSet;
    }

    const pieGenerator = pie().sort(null);

    const seriesNeededOnlyToKnowHowManyLayersDonutHas = seriesSet[0].data;

    const rawArcDataForAllSeries =
        seriesNeededOnlyToKnowHowManyLayersDonutHas.reduce(
            (accumulator: any[], value) => {
                accumulator.push(
                    seriesSet.map((s: IChartSeries<IRadialAccessors>) =>
                        isVisible(s) && !s.excludeFromArcCalculation
                            ? s.accessors.data.value(
                                  s.data[accumulator.length],
                                  accumulator.length,
                                  s.data,
                                  s
                              )
                            : 0
                    )
                );
                return accumulator;
            },
            []
        );

    const pieData = rawArcDataForAllSeries.map((rawArcData: any) =>
        pieGenerator(rawArcData)
    );

    return seriesSet.map(
        (s: IChartSeries<IRadialAccessors>, index: number) => ({
            ...s,
            data:
                s.preprocess === false
                    ? s.data
                    : pieData.map((d: any) => ({
                          ...d[index],
                          data: s.data[0],
                      })),
        })
    );
}

export function radial(
    this: ChartAssist,
    chartSeriesSet: IChartAssistSeries<IRadialAccessors>[]
): IChartSeries<IRadialAccessors>[] {
    return radialPreprocessor(
        chartSeriesSet,
        (series: IChartSeries<IRadialAccessors>) =>
            !this.isSeriesHidden(series.id)
    );
}
