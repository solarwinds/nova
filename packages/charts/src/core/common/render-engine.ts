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

import each from "lodash/each";
import isEqual from "lodash/isEqual";
import isUndefined from "lodash/isUndefined";
import values from "lodash/values";
import { Subject, Subscription } from "rxjs";

import {
    DATA_POINT_INTERACTION_RESET,
    HIGHLIGHT_DATA_POINT_EVENT,
    STANDARD_RENDER_LAYERS,
} from "../../constants";
import { IInteractionValuesPayload } from "../plugins/types";
import { DataManager } from "./data-manager";
import { Lasagna } from "./lasagna";
import {
    D3Selection,
    IAccessors,
    IChartSeries,
    IDataPoint,
    IDataPointsPayload,
    IInteractionDataPointsEvent,
    ILasagnaLayer,
    InteractionType,
    IPosition,
    IRenderContainers,
    IRendererEventPayload,
    IRenderStateData,
} from "./types";
import { UtilityService } from "./utility.service";

/**
 * @ignore
 * Entry for a lasagna layer index used for keeping track of the current series container structure
 */
interface ILayerIndexEntry {
    /** The series that have containers in a layer */
    seriesUsing: IChartSeries<IAccessors>[];
    /** The definition for the layer */
    layerDefinition: ILasagnaLayer;
}

/**
 * @ignore
 *
 * Manages and executes drawing and data point highlighting for each data series renderer and handles the setting of series display states
 */
export class RenderEngine {
    /** Subject for emitting events to the outside world about data points closest to an interaction on the chart */
    public interactionDataPointsSubject =
        new Subject<IInteractionDataPointsEvent>();
    /** Subject passed to the renderer for triggering events regarding a data point */
    public rendererSubject = new Subject<IRendererEventPayload>();

    private highlightDataPointSubscription: Subscription;
    private highlightedDataPoints: IDataPointsPayload = {};
    private renderLayers: { [layerName: string]: D3Selection } = {};
    private layerIndex: { [layerName: string]: ILayerIndexEntry } = {};

    constructor(private lasagna: Lasagna, private dataManager: DataManager) {
        this.highlightDataPointSubscription = this.rendererSubject.subscribe(
            (event: IRendererEventPayload) => {
                if (event.eventName === HIGHLIGHT_DATA_POINT_EVENT) {
                    this.highlightDataPoint(
                        event.data.seriesId,
                        event.data.index
                    );
                }
            }
        );
    }

    /**
     * Invokes the draw method on each of the series renderers
     */
    public update(): void {
        const scaleValidity: Record<string, boolean> = {};
        each(
            this.dataManager.chartSeriesSet,
            (chartSeries: IChartSeries<IAccessors>) => {
                const childContainers = this.getSeriesChildContainers(
                    chartSeries.id
                );
                const areDomainsValid =
                    -1 ===
                    Object.values(chartSeries.scales).findIndex((scale) => {
                        if (typeof scaleValidity[scale.id] === "undefined") {
                            const isValid = scale.isDomainValid();
                            if (!isValid) {
                                console.warn(
                                    "Invalid scale domain detected for scale:",
                                    scale
                                );
                            }
                            scaleValidity[scale.id] = isValid;
                        }
                        return !scaleValidity[scale.id];
                    });
                if (areDomainsValid) {
                    chartSeries.renderer.draw(
                        {
                            dataSeries: chartSeries,
                            containers: childContainers,
                            scales: chartSeries.scales,
                        },
                        this.rendererSubject
                    );
                }
            }
        );
    }

    /**
     * Updates the lasagna layers and series containers based on the current series set
     */
    public updateSeriesContainers(): void {
        this.layerIndex = this.buildLayerIndex(this.dataManager.chartSeriesSet);
        this.removeUnusedLayers();
        this.addNeededLayers();
        this.updateLayerContents();
    }

    /**
     * Emits the HIGHLIGHT_DATA_POINT_EVENT if the highlighted index changes for a particular series.
     * Emits an event with information about all of the highlighted data points if the highlighted index changes for any series.
     *
     * @param {IHighlightXYPayload} highlightedValues The highlighted values for each scale
     */
    public emitInteractionDataPoints(payload: IInteractionValuesPayload): void {
        let highlightChangeDetected = false;

        const interactionDataPoints = this.dataManager.chartSeriesSet.reduce(
            (result, chartSeries: IChartSeries<IAccessors>) => {
                const chartValues: { [axis: string]: any } = {};
                each(Object.keys(payload.values), (scaleKey) => {
                    const myScaleId = chartSeries.scales[scaleKey].id;
                    chartValues[scaleKey] = UtilityService.getInteractionValues(
                        payload.values[scaleKey],
                        myScaleId
                    );
                });

                let dataIndex = DATA_POINT_INTERACTION_RESET;
                if (chartSeries.data && chartSeries.data.length > 0) {
                    dataIndex = chartSeries.renderer.getDataPointIndex(
                        chartSeries,
                        chartValues,
                        chartSeries.scales
                    );
                }
                const position: IPosition | undefined =
                    chartSeries.renderer.getDataPointPosition(
                        chartSeries,
                        dataIndex,
                        chartSeries.scales
                    );

                const dataPoint: IDataPoint = {
                    seriesId: chartSeries.id,
                    dataSeries: chartSeries,
                    index: dataIndex,
                    data: dataIndex >= 0 ? chartSeries.data[dataIndex] : null,
                    position: position,
                };

                if (payload.interactionType === InteractionType.MouseMove) {
                    const prevHighlight =
                        this.highlightedDataPoints[chartSeries.id];
                    if (
                        !isUndefined(dataIndex) &&
                        (isUndefined(prevHighlight) ||
                            dataIndex === DATA_POINT_INTERACTION_RESET ||
                            dataIndex !== prevHighlight.index)
                    ) {
                        highlightChangeDetected = true;
                        this.rendererSubject.next({
                            eventName: HIGHLIGHT_DATA_POINT_EVENT,
                            data: dataPoint,
                        });
                    }
                }

                // Note that dataIndex that is equal to -1 or -2 will be treated as "please show last value" by the legend, so it is valuable
                result[chartSeries.id] = dataPoint;
                return result;
            },
            <IDataPointsPayload>{}
        );

        if (
            payload.interactionType !== InteractionType.MouseMove ||
            highlightChangeDetected
        ) {
            this.interactionDataPointsSubject.next({
                interactionType: payload.interactionType,
                dataPoints: interactionDataPoints,
            });
        }

        if (highlightChangeDetected) {
            this.highlightedDataPoints = interactionDataPoints;
        }
    }

    /**
     * Invokes the renderer highlightDataPoint method for the specified series
     *
     * @param {string} seriesId The series on which to highlight a data point
     * @param {number} index The data point index to highlight
     */
    public highlightDataPoint(seriesId: string, index: number): void {
        const childContainers = this.getSeriesChildContainers(seriesId);
        const chartSeries = this.dataManager.getChartSeries(seriesId);

        const renderSeries = {
            dataSeries: chartSeries,
            containers: childContainers,
            scales: chartSeries.scales,
        };
        chartSeries.renderer.highlightDataPoint(
            renderSeries,
            index,
            this.rendererSubject
        );
    }

    /**
     * Sets attributes specified in each state data object to the appropriate the series containers.
     * Invokes a renderer's setSeriesState method when the state of its series container has been updated.
     *
     * @param {IRenderStateData[]} stateDataSet A collection of series states
     */
    public setSeriesStates(stateDataSet: IRenderStateData[]): void {
        each(stateDataSet, ({ seriesId, state }) => {
            const chartSeries = this.dataManager.getChartSeries(seriesId);
            if (!chartSeries) {
                return;
            }
            const childContainers = this.getSeriesChildContainers(seriesId);

            const attrs = chartSeries.renderer.getContainerStateStyles(state);
            each(values(childContainers), (cc) => {
                cc.attrs(attrs);
            });

            chartSeries.renderer.setSeriesState(childContainers, state);
        });
    }

    public destroy(): void {
        if (this.highlightDataPointSubscription) {
            this.highlightDataPointSubscription.unsubscribe();
        }
        if (this.rendererSubject) {
            this.rendererSubject.complete();
        }
    }

    private buildLayerIndex(chartSeriesSet: IChartSeries<IAccessors>[]): {
        [layerName: string]: ILayerIndexEntry;
    } {
        const layerIndex: { [layerName: string]: ILayerIndexEntry } = {};
        each(chartSeriesSet, (chartSeries) => {
            each(chartSeries.renderer.getRequiredLayers(), (layerDef) => {
                if (
                    STANDARD_RENDER_LAYERS[layerDef.name] &&
                    !isEqual(STANDARD_RENDER_LAYERS[layerDef.name], layerDef)
                ) {
                    throw new Error(
                        `Custom definition detected for render layer "${layerDef.name}". ` +
                            `Custom layers must use a name not already taken by the predefined layer set.`
                    );
                }

                let layer = layerIndex[layerDef.name];
                if (!layer) {
                    layer = {
                        seriesUsing: [],
                        layerDefinition: layerDef,
                    };
                    layerIndex[layerDef.name] = layer;
                }
                layer.seriesUsing.push(chartSeries);
            });
        });
        return layerIndex;
    }

    private removeUnusedLayers(): void {
        each(Object.keys(this.renderLayers), (layerName) => {
            if (!this.layerIndex[layerName]) {
                this.lasagna.removeLayer(layerName);
                delete this.renderLayers[layerName];
            }
        });
    }

    private addNeededLayers(): void {
        each(this.layerIndex, (layerData) => {
            if (!this.renderLayers[layerData.layerDefinition.name]) {
                this.renderLayers[layerData.layerDefinition.name] =
                    this.lasagna.addLayer(layerData.layerDefinition);
            }
        });
    }

    private updateLayerContents(): void {
        each(Object.keys(this.renderLayers), (layerName) => {
            const renderLayer = this.renderLayers[layerName];
            const containers = renderLayer
                .selectAll<SVGElement, IChartSeries<IAccessors>>(
                    "g.data-series-container"
                )
                .data(
                    this.layerIndex[layerName].seriesUsing,
                    (d: IChartSeries<IAccessors>) => d.id
                )
                .order();

            containers
                .enter()
                .append("g")
                .attrs({
                    id: (d: IChartSeries<IAccessors>) =>
                        this.getChildContainerId(layerName, d.id),
                    class: "data-series-container",
                });

            containers.exit().remove();
        });
    }

    private getSeriesChildContainers(seriesId: string): IRenderContainers {
        const childContainers: { [name: string]: D3Selection<SVGGElement> } =
            {};
        each(Object.keys(this.renderLayers), (layerName) => {
            const renderLayer = this.renderLayers[layerName];
            childContainers[layerName] = renderLayer.selectAll(
                `#${layerName}-${UtilityService.cssEscape(seriesId)}`
            );
        });
        return childContainers;
    }

    private getChildContainerId(layerName: string, seriesId: string): string {
        return layerName + "-" + seriesId;
    }
}
