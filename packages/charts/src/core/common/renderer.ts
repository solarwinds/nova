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

import { extent, Numeric } from "d3-array";
import { Selection } from "d3-selection";
import { ValueMap } from "d3-selection-multi";
import defaultsDeep from "lodash/defaultsDeep";
import each from "lodash/each";
import get from "lodash/get";
import { Subject } from "rxjs";

import { DATA_POINT_NOT_FOUND, STANDARD_RENDER_LAYERS } from "../../constants";
import {
    IRenderSeries,
    RenderLayerName,
    RenderState,
} from "../../renderers/types";
import { EMPTY_CONTINUOUS_DOMAIN, IScale, Scales } from "./scales/types";
import {
    D3Selection,
    IAccessors,
    IDataPoint,
    IDataSeries,
    ILasagnaLayer,
    IPosition,
    IRenderContainers,
    IRendererConfig,
    IRendererEventPayload,
} from "./types";

/**
 * The abstract base class for chart renderers with some limited default functionality
 */
// For why the "dynamic" decorator is used see https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
export abstract class Renderer<TA extends IAccessors> {
    public static readonly DEFAULT_CONFIG: IRendererConfig = {
        stateStyles: {
            [RenderState.default]: {
                opacity: 1,
            },
            [RenderState.hidden]: {
                opacity: 0,
            },
            [RenderState.deemphasized]: {
                opacity: 0.1,
            },
            [RenderState.emphasized]: {
                opacity: 1,
            },
        },
    };

    constructor(public config: IRendererConfig = {}) {
        // setting default values to the properties that were not set by user
        this.config = defaultsDeep(this.config, Renderer.DEFAULT_CONFIG);
    }

    public interaction: Record<string, any> = {};

    /**
     * Draw the visual representation of the provided data series
     *
     * @param {IRenderSeries} renderSeries The series to render
     * @param {Subject<IRendererEventPayload>} rendererSubject A subject to optionally invoke for emitting events regarding a data point
     */
    public abstract draw(
        renderSeries: IRenderSeries<TA>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void;

    /**
     * Return position of a specified datapoint
     *
     * @param {IDataSeries} dataSeries
     * @param {number} index
     * @param {Scales} scales
     * @returns {IPosition}
     */
    public abstract getDataPointPosition(
        dataSeries: IDataSeries<TA>,
        index: number,
        scales: Scales
    ): IPosition | undefined;

    /**
     * Based on provided values, return the nearest data point that the given coordinates represent. This is used for mouse hover behavior
     *
     * @param {IDataSeries} series series from which to determine the index corresponding to the specified values
     * @param {{ [axis: string]: any }} values the values from which a data point index can be determined
     * @param {Scales} scales the scales to be used in the index calculation
     *
     * @returns {number} negative value means that index is not found
     */
    public getDataPointIndex(
        series: IDataSeries<TA>,
        values: { [axis: string]: any },
        scales: Scales
    ): number {
        return DATA_POINT_NOT_FOUND;
    }

    /**
     * Highlight the data point corresponding to the specified data point index
     *
     * @param {IRenderSeries} renderSeries The series on which to render the data point highlight
     * @param {number} dataPointIndex index of the highlighted point within the data series (pass -1 to remove the highlight marker)
     * @param {Subject<IRendererEventPayload>} rendererSubject A subject to optionally invoke for emitting events regarding a data point
     */
    public highlightDataPoint(
        renderSeries: IRenderSeries<TA>,
        dataPointIndex: number,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}

    /**
     * Get the style attributes for the specified state that we need to apply to a series container
     *
     * @param {RenderState} state the state for which to retrieve container styles
     *
     * @returns {ValueMap<any, any>} the container styles for the specified state
     */
    public getContainerStateStyles = (
        state: RenderState
    ): ValueMap<any, any> => {
        if (!this.config.stateStyles) {
            throw new Error("stateStyles property is not defined");
        }
        return this.config.stateStyles[state || RenderState.default];
    };

    /**
     * Set the RenderState of the target data series
     *
     * @param {IRenderContainers} renderContainers the render containers of the series
     * @param {RenderState} state The new state for the target series
     */
    public setSeriesState(
        renderContainers: IRenderContainers,
        state: RenderState
    ): void {}

    /**
     * Set the RenderState of the target data point
     *
     * @param {D3Selection} target the target data point
     * @param {RenderState} state The new state for the target data point
     */
    public setDataPointState(target: D3Selection, state: RenderState): void {}

    /**
     * Calculate domain for data filtered by given filterScales
     *
     * @param dataSeries
     * @param filterScales
     * @param scaleKey
     * @param scale
     * @returns array of datapoints from <code>dataSeries</code> filtered by domains of given <code>filterScale</code>s
     */
    public getDomainOfFilteredData(
        dataSeries: IDataSeries<TA>,
        filterScales: Record<string, IScale<any>>,
        scaleKey: string,
        scale: IScale<any>
    ): any[] {
        let filteredData = dataSeries.data;
        for (const fixedScaleKey of Object.keys(filterScales)) {
            const filterScale = filterScales[fixedScaleKey];
            if (!filterScale.isDomainFixed || !filterScale.isContinuous()) {
                continue;
            }

            filteredData = this.filterDataByDomain(
                filteredData,
                dataSeries,
                fixedScaleKey,
                filterScale.domain()
            );
        }

        return this.getDomain(filteredData, dataSeries, scaleKey, scale);
    }

    /**
     * Calculate the domain using the data of a series
     *
     * @param {any[]} data source data, can be filtered
     * @param dataSeries related data series
     * @param {string} scaleName name of the scale for which domain calculation is needed
     * @param scale
     *
     * @returns {[any, any]} min and max values as an array
     */
    public getDomain(
        data: any[],
        dataSeries: IDataSeries<TA>,
        scaleName: string,
        scale: IScale<any>
    ): any[] {
        if (!data || data.length === 0) {
            return EMPTY_CONTINUOUS_DOMAIN;
        }

        return extent<Numeric, Numeric>(data, (datum, index, arr) =>
            dataSeries.accessors.data?.[scaleName]?.(
                datum,
                index,
                Array.from(arr),
                dataSeries
            )
        );
    }

    /**
     * Filters given dataset by domain of provided scale
     *
     * @param data
     * @param dataSeries
     * @param scaleName
     * @param domain
     */
    public filterDataByDomain(
        data: any[],
        dataSeries: IDataSeries<TA>,
        scaleName: string,
        domain: any[]
    ): any[] {
        const accessor = dataSeries.accessors.data?.[scaleName];

        // if (isNil(accessor)) {
        //     throw new Error("accessor is not defined");
        // }

        return data.filter((d, i) => {
            // @ts-ignore
            const value = accessor(d, i, data, dataSeries);
            return value >= domain[0] && value <= domain[1];
        });
    }

    /**
     * Get the definitions of lasagna layers required for visualizing data
     *
     * @returns {ILasagnaLayer[]} lasagna layer definitions
     */
    public getRequiredLayers(): ILasagnaLayer[] {
        return [STANDARD_RENDER_LAYERS[RenderLayerName.data]];
    }

    protected setupInteraction(
        path: string[],
        nativeEvent: string,
        target: Selection<any, any, any, any>,
        dataPointSubject: Subject<IRendererEventPayload>,
        dataPoint: Partial<IDataPoint>
    ): void {
        const eventList: string[] = get(this.interaction, path, {})[
            nativeEvent
        ];
        if (!eventList) {
            return;
        }

        each(eventList, (targetEvent: string) => {
            target.on(nativeEvent, () => {
                const bbox = target.node().getBoundingClientRect();
                dataPointSubject.next({
                    eventName: targetEvent,
                    data: <IDataPoint>{
                        ...dataPoint,
                        position: bbox,
                    },
                });
            });
        });
    }
}
