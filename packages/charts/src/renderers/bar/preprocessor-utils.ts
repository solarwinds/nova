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
