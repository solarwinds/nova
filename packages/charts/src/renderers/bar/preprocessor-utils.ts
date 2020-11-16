import union from "lodash/union";

import { IChartSeries } from "../../core/common/types";

import { IBarAccessors } from "./accessors/bar-accessors";

/** @ignore*/
export function gatherCategories(chartSeriesSet: IChartSeries<IBarAccessors>[], type: string = "category"): string[] {
    return chartSeriesSet.reduce((acc: string[], chartSeries) => {
        const categoryAccessor = chartSeries.accessors.data[type];
        const categories = chartSeries.data.reduce((accInner: string[], datum, index: number) => {
            accInner.push(categoryAccessor?.(datum, index, chartSeries.data, chartSeries));
            return accInner;
        }, []);
        return union(acc, categories);
    }, []);
}
