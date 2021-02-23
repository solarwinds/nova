import isUndefined from "lodash/isUndefined";

import { ChartAssist } from "../../core/chart-assists/chart-assist";
import { IChartAssistSeries, IChartSeries } from "../../core/common/types";
import { IBarAccessors } from "../public-api";

import { gatherCategories } from "./preprocessor-utils";

export function stackedPreprocessor(chartSeriesSet: IChartSeries<IBarAccessors>[],
                                    isVisible: (chartSeries: IChartSeries<IBarAccessors>) => boolean): IChartSeries<IBarAccessors>[] {
    // No need to preprocess empty series.
    if (chartSeriesSet.length === 0) {
        return chartSeriesSet;
    }

    const categories = gatherCategories(chartSeriesSet);

    // This is adding metadata to the dataset and filling missing
    const forExtents = chartSeriesSet.reduce((acc: number[], chartSeries) => {
        if (!isUndefined(chartSeries.preprocess) && !chartSeries.preprocess) {
            return acc;
        }

        const categoryAccessor = chartSeries.accessors.data["category"];
        const valueAccessor = chartSeries.accessors.data["value"];

        if (!valueAccessor) {
            throw new Error("valueAccessor is not defined");
        }
        // index makes algorithm faster
        const dataIndex = chartSeries.data.reduce((accInner: any, next: any, i: number) =>
            ({
                ...accInner,
                [categoryAccessor(next, i, chartSeries.data, chartSeries)]: i,
            }), {});
        const reorderedData: any[] = [];

        categories.forEach((category: string, i) => {
            let datum: any;
            if (dataIndex[category] !== undefined) {
                datum = chartSeries.data[dataIndex[category]];
                const metadata: any = {};
                const coef = isVisible(chartSeries) ? 1 : 0;
                metadata.start = acc[i];
                acc[i] += (valueAccessor(datum, dataIndex[category], chartSeries.data, chartSeries) || 0) * coef;
                metadata.end = acc[i];
                datum["__bar"] = metadata;
                reorderedData.push(datum);
            }
        });

        chartSeries.data = reorderedData;
        return acc;
    }, Array.apply(null, Array(categories.length)).map(() => 0));

    return chartSeriesSet;
}

export function stack(this: ChartAssist, chartSeriesSet: IChartAssistSeries<IBarAccessors>[]):  IChartAssistSeries<IBarAccessors>[] {
    return stackedPreprocessor(chartSeriesSet, (series: IChartSeries<IBarAccessors>) => !this.isSeriesHidden(series.id));
}
