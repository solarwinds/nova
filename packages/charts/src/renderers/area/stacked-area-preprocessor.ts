import { ChartAssist } from "../../core/chart-assists/chart-assist";
import { IChartAssistSeries, IChartSeries } from "../../core/common/types";
import { IStackMetadata } from "../bar/types";

import { IAreaAccessors } from "./area-accessors";

export function stackedAreaPreprocessor(chartSeriesSet: IChartSeries<IAreaAccessors>[],
                                        isVisible: (chartSeries: IChartSeries<IAreaAccessors>) => boolean): IChartSeries<IAreaAccessors>[] {
    // No need to preprocess empty series.
    if (chartSeriesSet.length === 0) {
        return chartSeriesSet;
    }

    const domainValueStacks: Record<any, number> = {};

    const baseAccessorKey = "x";
    const valueAccessorKey = "y";

    for (const chartSeries of chartSeriesSet) {
        const baseAccessor = chartSeries.accessors.data[baseAccessorKey];
        const accessor0 = chartSeries.accessors.data[valueAccessorKey + "0"];
        const accessor1 = chartSeries.accessors.data[valueAccessorKey + "1"];
        const coef = isVisible(chartSeries) ? 1 : 0;

        chartSeries.data.forEach((datum, index) => {
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

            const end = start + diff;
            domainValueStacks[base.valueOf()] = end;

            datum["__stack_" + valueAccessorKey] = { start, end } as IStackMetadata;
        });
    }

    return chartSeriesSet;
}

export function stackedArea(this: ChartAssist, chartSeriesSet: IChartAssistSeries<IAreaAccessors>[]): IChartAssistSeries<IAreaAccessors>[] {
    return stackedAreaPreprocessor(chartSeriesSet, (series: IChartSeries<IAreaAccessors>) => !this.isSeriesHidden(series.id));
}
