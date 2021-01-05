import { select } from "d3-selection";
import findIndex from "lodash/findIndex";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { DATA_POINT_INTERACTION_RESET, DATA_POINT_NOT_FOUND } from "../../../constants";
import { TimeIntervalScale } from "../../../core/common/scales/time-interval-scale";
import { TimeScale } from "../../../core/common/scales/time-scale";
import { isBandScale, IXYScales, Scales } from "../../../core/common/scales/types";
import { IDataSeries, IRendererEventPayload } from "../../../core/common/types";
import { UtilityService } from "../../../core/common/utility.service";
import { IRectangleAccessors } from "../../accessors/rectangle-accessors";
import { IHighlightStrategy, IRenderSeries, RenderLayerName, RenderState } from "../../types";
import { BarRenderer } from "../bar-renderer";

export type SelectedDatPointIdxFn = (seriesId: string) => number;

export class BarHighlightStrategy implements IHighlightStrategy<IRectangleAccessors, BarRenderer> {

    /**
     * @param scaleKey scale that will be used for searching for the data point that will be highlighted
     * @param levels for band scales, how many levels deep do we go to compare values
     */
    constructor(private scaleKey: keyof IXYScales, private levels = 1, private selectedDataPointIdxFn?: SelectedDatPointIdxFn) {
    }

    public getDataPointIndex(renderer: BarRenderer, series: IDataSeries<IRectangleAccessors>, values: { [p: string]: any }, scales: Scales) {
        const value = values[this.scaleKey];
        if (typeof value === "undefined") {
            // if there is no value we're returning -2 (DATA_POINT_INTERACTION_RESET) which helps highlightDataPoint
            // to understand that we need to emphasise things when we are moving outside of an interactive area
            return DATA_POINT_INTERACTION_RESET;
        }

        return this.findDataPointByValue(series, value, this.scaleKey, scales);
    }

    public findDataPointByValue(series: IDataSeries<IRectangleAccessors>, value: any, scaleKey: keyof IXYScales, scales?: Scales) {
        const accessorSuffix = (scaleKey as string).toUpperCase();
        const dataAccessors = series.accessors.data;

        const startAccessor = dataAccessors["start" + accessorSuffix];
        const endAccessor = dataAccessors["end" + accessorSuffix];

        if (typeof value === "string") {
            return findIndex(series.data,
                (d, i) => value === startAccessor?.(d, i, series.data, series));
        } else if (isArray(value)) {
            return findIndex(series.data,
                (d, i) => {
                    const start = startAccessor?.(d, i, series.data, series);
                    const lengthLimit = Math.min(this.levels, value.length, start.length);
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
            if (scales && scales[scaleKey]?.isContinuous()) {
                let index = findIndex(series.data,
                    (d, i) => valueOf >= startAccessor?.(d, i, series.data, series).valueOf() &&
                        valueOf <= endAccessor?.(d, i, series.data, series).valueOf());
                if (index === -1 && typeof endAccessor !== "undefined") {
                    
                    if (isBandScale(scales[scaleKey])) {
                        const accessor = (d: any, i: any) => startAccessor?.(d, i, series.data, series);
                        const nearestIndex = UtilityService.findNearestIndex(series.data, value, accessor);
                        
                        index = (nearestIndex >= series.data.length || accessor(series.data[nearestIndex], nearestIndex) > valueOf) ? -1 : nearestIndex;
                        
                    } else {
                        // @ts-ignore
                        // Needs to catch -1 otherwise typescript errors
                        index = UtilityService.getClosestIndex(series.data, (d, i) => endAccessor(d, i, series.data, series), value) ?? -1;
                    }
                }
                return index;
            }
            return findIndex(series.data,
                (d, i) => valueOf >= startAccessor?.(d, i, series.data, series).valueOf() &&
                    valueOf <= endAccessor?.(d, i, series.data, series).valueOf());
        }

        return DATA_POINT_INTERACTION_RESET;
    }

    public highlightDataPoint(renderer: BarRenderer, renderSeries: IRenderSeries<IRectangleAccessors>,
                              dataPointIndex: number, rendererSubject: Subject<IRendererEventPayload>): void {
        const target = renderSeries.containers[RenderLayerName.data];
        const barStylesFn = renderer.getContainerStateStyles;
        const selectedDataPointIdx = !isUndefined(this.selectedDataPointIdxFn) ? this.selectedDataPointIdxFn(renderSeries.dataSeries.id) : DATA_POINT_NOT_FOUND;

        target.selectAll(`g.${ renderer.barContainerClass }`).each(function (d: any, index: number) {
            let renderState: RenderState;
            if (dataPointIndex === DATA_POINT_INTERACTION_RESET) {
                if (index === selectedDataPointIdx || selectedDataPointIdx === DATA_POINT_NOT_FOUND) {
                    renderState = RenderState.default;
                } else {
                    renderState = RenderState.deemphasized;
                }
            } else if (dataPointIndex === index || index === selectedDataPointIdx) {
                renderState = RenderState.emphasized;
            } else {
                renderState = RenderState.deemphasized;
            }
            select(this).attrs(barStylesFn(renderState));
        });

        // rendererSubject.next({
        //     eventName: HIGHLIGHT_SERIES_EVENT,
        //     data: renderer.getDataPoint(renderSeries, renderSeries.dataSeries.data[dataPointIndex], dataPointIndex),
        // });
    }

    draw(renderer: BarRenderer, renderSeries: IRenderSeries<IRectangleAccessors>, rendererSubject: Subject<IRendererEventPayload>) {
    }

}
