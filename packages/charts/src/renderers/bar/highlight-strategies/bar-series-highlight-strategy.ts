import findIndex from "lodash/findIndex";
import isArray from "lodash/isArray";
import { Subject } from "rxjs";

import {
    DATA_POINT_INTERACTION_RESET,
    HIGHLIGHT_SERIES_EVENT,
} from "../../../constants";
import { IXYScales, Scales } from "../../../core/common/scales/types";
import { IDataSeries, IRendererEventPayload } from "../../../core/common/types";
import { IRectangleAccessors } from "../../accessors/rectangle-accessors";
import { IHighlightStrategy, IRenderSeries } from "../../types";
import { BarRenderer } from "../bar-renderer";

export class BarSeriesHighlightStrategy
    implements IHighlightStrategy<IRectangleAccessors, BarRenderer>
{
    /**
     * @param scaleKey scale that will be used for searching for the datapoint that will be highlighted
     * @param levels for band scales, how many levels deep do we go to compare values
     */
    constructor(private scaleKey: keyof IXYScales, private levels = 1) {}

    public getDataPointIndex(
        renderer: BarRenderer,
        series: IDataSeries<IRectangleAccessors>,
        values: { [p: string]: any },
        scales: Scales
    ) {
        const value = values[this.scaleKey];
        if (typeof value === "undefined") {
            // if there is no value we're returning -2 (DATA_POINT_INTERACTION_RESET) which helps highlightDataPoint
            // to understand that we need to emphasise things when we are moving outside of an interactive area
            return DATA_POINT_INTERACTION_RESET;
        }

        return this.findDataPointByValue(series, value, this.scaleKey);
    }

    public findDataPointByValue(
        series: IDataSeries<IRectangleAccessors>,
        value: any,
        scaleKey: keyof IXYScales
    ) {
        const accessorSuffix = (scaleKey as string).toUpperCase();
        const dataAccessors = series.accessors.data;

        const startAccessor = dataAccessors["start" + accessorSuffix];
        const endAccessor = dataAccessors["end" + accessorSuffix];

        if (typeof value === "string") {
            return findIndex(
                series.data,
                (d, i) => value === startAccessor?.(d, i, series.data, series)
            );
        } else if (isArray(value)) {
            return findIndex(series.data, (d, i) => {
                const start = startAccessor?.(d, i, series.data, series);
                const lengthLimit = Math.min(
                    this.levels,
                    value.length,
                    start.length
                );
                // diy efficient array comparison
                for (let j = 0; j < lengthLimit; j++) {
                    if (value[j] !== start[j]) {
                        return false;
                    }
                }
                return true;
            });
        } else if (value.valueOf) {
            const valueOf = value.valueOf();
            return findIndex(
                series.data,
                (d, i) =>
                    valueOf >=
                        startAccessor?.(d, i, series.data, series).valueOf() &&
                    valueOf <=
                        endAccessor?.(d, i, series.data, series).valueOf()
            );
        }

        return DATA_POINT_INTERACTION_RESET;
    }

    public highlightDataPoint(
        renderer: BarRenderer,
        renderSeries: IRenderSeries<IRectangleAccessors>,
        dataPointIndex: number,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        if (
            dataPointIndex >= 0 ||
            dataPointIndex === DATA_POINT_INTERACTION_RESET
        ) {
            rendererSubject.next({
                eventName: HIGHLIGHT_SERIES_EVENT,
                data: renderer.getDataPoint(
                    renderSeries,
                    renderSeries.dataSeries.data[dataPointIndex],
                    dataPointIndex
                ),
            });
        }
    }

    draw(
        renderer: BarRenderer,
        renderSeries: IRenderSeries<IRectangleAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ) {}
}
