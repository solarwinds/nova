import { pie } from "d3-shape";

import { ChartAssist } from "../../core/chart-assists/chart-assist";
import { IChartAssistSeries, IChartSeries } from "../../core/common/types";

import { IRadialAccessors } from "./accessors/radial-accessors";

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
