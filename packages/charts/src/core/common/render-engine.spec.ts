import { BaseType, select, Selection } from "d3-selection";
import { ValueMap } from "d3-selection-multi";
import cloneDeep from "lodash/cloneDeep";
import { Subject, Subscription } from "rxjs";

import {
    DATA_POINT_INTERACTION_RESET,
    HIGHLIGHT_DATA_POINT_EVENT,
    STANDARD_RENDER_LAYERS,
} from "../../constants";
import {
    IRenderSeries,
    RenderLayerName,
    RenderState,
} from "../../renderers/types";

import { DataManager } from "./data-manager";
import { Lasagna } from "./lasagna";
import { RenderEngine } from "./render-engine";
import { Renderer } from "./renderer";
import { IScale, Scales } from "./scales/types";
import {
    D3Selection,
    IAccessors,
    IChartSeries,
    IDataPoint,
    IDataSeries,
    ILasagnaLayer,
    InteractionType,
    IPosition,
    IRendererEventPayload,
} from "./types";

class MockRenderer<TA extends IAccessors> extends Renderer<TA> {
    public draw(
        renderSeries: IRenderSeries<IAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}

    public getDataPointPosition(
        dataSeries: IDataSeries<IAccessors>,
        index: number,
        scales: Scales
    ): IPosition {
        // @ts-ignore: Disabled for testing purposes
        return null;
    }
}

class MockBackgroundRenderer extends MockRenderer<IAccessors> {
    public getRequiredLayers(): ILasagnaLayer[] {
        return [STANDARD_RENDER_LAYERS[RenderLayerName.background]];
    }
}

class MockDataRenderer extends MockRenderer<IAccessors> {
    public getRequiredLayers(): ILasagnaLayer[] {
        return [STANDARD_RENDER_LAYERS[RenderLayerName.data]];
    }

    public getContainerStateStyles = (
        state: RenderState
    ): ValueMap<any, any> => {
        const styleState = {
            opacity: 1,
            visibility: "visible",
        };

        switch (state) {
            case RenderState.hidden:
                styleState.visibility = "hidden";
                break;
        }

        return styleState;
    };
}

class MockForegroundRenderer extends MockRenderer<IAccessors> {
    public getRequiredLayers(): ILasagnaLayer[] {
        return [STANDARD_RENDER_LAYERS[RenderLayerName.foreground]];
    }
}

describe("components >", () => {
    let lasagna: Lasagna;
    let dataManager: DataManager;
    let renderEngine: RenderEngine;
    // Using any as a fallback type to avoid strict mode error
    let svg: D3Selection<SVGSVGElement> | any;
    let mockDoubleSeriesSet: IChartSeries<IAccessors>[];

    let mockSingleSeriesSet: IChartSeries<IAccessors>[];

    beforeEach(() => {
        mockDoubleSeriesSet = [
            {
                id: "1",
                name: "Series 1",
                data: [1, 2],
                renderer: new MockBackgroundRenderer(),
                scales: {},
                // @ts-ignore: Disabled for testing purposes
                accessors: null,
            },
            {
                id: "2",
                name: "Series 2",
                data: [1, 2],
                renderer: new MockDataRenderer(),
                scales: {},
                // @ts-ignore: Disabled for testing purposes
                accessors: null,
            },
        ];

        mockSingleSeriesSet = [
            {
                id: "1",
                name: "Series 1",
                data: [1, 2],
                renderer: new MockDataRenderer(),
                scales: {},
                // @ts-ignore: Disabled for testing purposes
                accessors: null,
            },
        ];
    });

    const getSeriesContainer = (
        layerName: RenderLayerName,
        seriesId: string
    ): Selection<SVGElement, any, BaseType, {}> => {
        const dataLayer = svg.selectAll(
            `g.${Lasagna.LAYER_CLASS}-${layerName}`
        );
        const seriesContainerSelector = `#${layerName}-${seriesId}`;
        return dataLayer.selectAll(seriesContainerSelector);
    };

    describe("render-engine >", () => {
        beforeEach(() => {
            svg = select(document.createElement("div")).append("svg");
            lasagna = new Lasagna(svg, "");
            dataManager = new DataManager();
            dataManager.update(mockDoubleSeriesSet);
            renderEngine = new RenderEngine(lasagna, dataManager);
            renderEngine.updateSeriesContainers();
        });

        describe("update >", () => {
            it("should invoke draw on the renderer for each series", () => {
                mockDoubleSeriesSet.forEach((series) =>
                    spyOn(series.renderer, "draw")
                );
                renderEngine.update();
                mockDoubleSeriesSet.forEach(async (series) =>
                    expect(series.renderer.draw).toHaveBeenCalled()
                );
            });

            it("should not invoke draw on the renderer for series with an invalid scale domain", () => {
                const invalidScale = {
                    id: "x",
                    isDomainValid: () => false,
                } as IScale<any>;
                const validScale = {
                    id: "y",
                    isDomainValid: () => true,
                } as IScale<any>;
                mockDoubleSeriesSet = mockDoubleSeriesSet.map((series) => {
                    series.scales = {
                        x: invalidScale,
                        y: validScale,
                    };
                    return series;
                });
                dataManager.update(mockDoubleSeriesSet);

                mockDoubleSeriesSet.forEach((series) =>
                    spyOn(series.renderer, "draw")
                );

                // suppress console warning
                const consoleWarnFn = console.warn;
                console.warn = () => null;

                renderEngine.update();

                // restore console warning
                console.warn = consoleWarnFn;

                mockDoubleSeriesSet.forEach(async (series) =>
                    expect(series.renderer.draw).not.toHaveBeenCalled()
                );
            });
        });

        describe("highlightDataPointSubscription >", () => {
            it("should invoke highlightDataPoint on triggering of HIGHLIGHT_DATA_POINT_EVENT", () => {
                renderEngine.update();
                spyOn(renderEngine, "highlightDataPoint");
                renderEngine.rendererSubject.next({
                    eventName: HIGHLIGHT_DATA_POINT_EVENT,
                    data: {
                        seriesId: mockDoubleSeriesSet[1].id,
                        index: 0,
                        data: {},
                        position: null,
                    },
                });
                expect(renderEngine.highlightDataPoint).toHaveBeenCalled();
            });
        });

        describe("updateSeriesContainers >", () => {
            it("should invoke lasagna.removeLayer when a layer is no longer needed", () => {
                const newSeriesSet = cloneDeep(mockDoubleSeriesSet);
                newSeriesSet.splice(0, 1);
                dataManager.update(newSeriesSet);

                spyOn(lasagna, "removeLayer");
                renderEngine.updateSeriesContainers();
                expect(lasagna.removeLayer).toHaveBeenCalledWith("background");
            });

            it("should invoke lasagna.addLayer when an added series needs a new layer", () => {
                const newSeriesSet = cloneDeep(mockDoubleSeriesSet);
                newSeriesSet.push({
                    id: "3",
                    name: "Series 3",
                    data: [],
                    renderer: new MockForegroundRenderer(),
                    scales: {},
                    // @ts-ignore: Disabled for testing purposes
                    accessors: null,
                });
                dataManager.update(newSeriesSet);

                spyOn(lasagna, "addLayer").and.callThrough();
                renderEngine.updateSeriesContainers();
                expect(lasagna.addLayer).toHaveBeenCalledWith(
                    STANDARD_RENDER_LAYERS[RenderLayerName.foreground]
                );
            });

            it("should only include a series container in a layer if it's needed by the series", () => {
                let seriesContainer = getSeriesContainer(
                    RenderLayerName.data,
                    mockDoubleSeriesSet[1].id
                );
                expect(seriesContainer.nodes().length).toEqual(1);
                seriesContainer = getSeriesContainer(
                    RenderLayerName.background,
                    mockDoubleSeriesSet[1].id
                );
                expect(seriesContainer.nodes().length).toEqual(0);
            });

            it("should add a series container to the appropriate layer(s) when a series is added", () => {
                const newSeriesSet = cloneDeep(mockDoubleSeriesSet);
                newSeriesSet.push({
                    id: "3",
                    name: "Series 3",
                    data: [1, 2],
                    renderer: new MockDataRenderer(),
                    scales: {},
                    // @ts-ignore: Disabled for testing purposes
                    accessors: null,
                });
                dataManager.update(newSeriesSet);
                renderEngine.updateSeriesContainers();

                const seriesContainer = getSeriesContainer(
                    RenderLayerName.data,
                    newSeriesSet[2].id
                );
                expect(seriesContainer.nodes().length).toEqual(1);
            });

            it("should remove a series container from the appropriate layer(s) when a series is removed", () => {
                const newSeriesSet = cloneDeep(mockDoubleSeriesSet);
                const mockSeriesId = "3";
                newSeriesSet.push({
                    id: mockSeriesId,
                    name: "Series 3",
                    data: [1, 2],
                    renderer: new MockDataRenderer(),
                    scales: {},
                    // @ts-ignore: Disabled for testing purposes
                    accessors: null,
                });

                // add series
                dataManager.update(newSeriesSet);
                renderEngine.updateSeriesContainers();

                // remove series
                newSeriesSet.splice(2, 1);
                dataManager.update(newSeriesSet);
                renderEngine.updateSeriesContainers();

                const seriesContainer = getSeriesContainer(
                    RenderLayerName.data,
                    mockSeriesId
                );
                expect(seriesContainer.nodes().length).toEqual(0);
            });
        });

        describe("emitInteractionDataPoints >", () => {
            it("should add a data point to the collection of highlighted data points", () => {
                dataManager.update(mockSingleSeriesSet);

                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(
                    (<any>renderEngine).highlightedDataPoints[1]
                ).toBeDefined();
            });

            it(`should add a data point with the DATA_POINT_INTERACTION_RESET index for a series with
            null data to the collection of highlighted data points`, () => {
                // @ts-ignore: Disabled for testing purposes
                mockDoubleSeriesSet[0].data = null;
                dataManager.update(mockDoubleSeriesSet);

                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(
                    (<any>renderEngine).highlightedDataPoints[1].index
                ).toEqual(DATA_POINT_INTERACTION_RESET);
                expect(
                    (<any>renderEngine).highlightedDataPoints[2]
                ).toBeDefined();
            });

            it("should not add a data point for a series with empty data to the collection of highlighted data points", () => {
                mockDoubleSeriesSet[0].data = [];
                dataManager.update(mockDoubleSeriesSet);

                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(
                    (<any>renderEngine).highlightedDataPoints[1].index
                ).toEqual(DATA_POINT_INTERACTION_RESET);
                expect(
                    (<any>renderEngine).highlightedDataPoints[2]
                ).toBeDefined();
            });

            it(`should trigger a HIGHLIGHT_DATA_POINT_EVENT and the interactionDataPointsSubject if the dataIndex
                is defined for the highlighted value`, () => {
                dataManager.update(mockSingleSeriesSet);

                const mockDataIndex = 1;
                const getDataPointIndexSpy = spyOn(
                    mockSingleSeriesSet[0].renderer,
                    "getDataPointIndex"
                );
                getDataPointIndexSpy.and.returnValue(mockDataIndex);
                spyOn(renderEngine.rendererSubject, "next");
                spyOn(renderEngine.interactionDataPointsSubject, "next");
                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });

                const expectedDataPoint: IDataPoint = {
                    seriesId: mockSingleSeriesSet[0].id,
                    dataSeries: mockSingleSeriesSet[0],
                    index: mockDataIndex,
                    data: mockSingleSeriesSet[0].data[1],
                    // @ts-ignore: Disabled for testing purposes
                    position: null,
                };

                expect(renderEngine.rendererSubject.next).toHaveBeenCalledWith(<
                    IRendererEventPayload
                >{
                    eventName: HIGHLIGHT_DATA_POINT_EVENT,
                    data: expectedDataPoint,
                });
                expect(
                    renderEngine.interactionDataPointsSubject.next
                ).toHaveBeenCalledWith({
                    interactionType: InteractionType.MouseMove,
                    dataPoints: {
                        [mockSingleSeriesSet[0].id]: expectedDataPoint,
                    },
                });
            });

            it(`should trigger HIGHLIGHT_DATA_POINT_EVENT if the data of a series is empty`, () => {
                mockSingleSeriesSet[0].data = [];
                const expectedDataPoint: IDataPoint = {
                    seriesId: mockSingleSeriesSet[0].id,
                    dataSeries: mockSingleSeriesSet[0],
                    index: DATA_POINT_INTERACTION_RESET,
                    data: null,
                    // @ts-ignore: Disabled for testing purposes
                    position: null,
                };

                dataManager.update(mockSingleSeriesSet);

                spyOn(renderEngine.rendererSubject, "next");
                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(renderEngine.rendererSubject.next).toHaveBeenCalledWith(<
                    IRendererEventPayload
                >{
                    eventName: HIGHLIGHT_DATA_POINT_EVENT,
                    data: expectedDataPoint,
                });
            });

            it(`should trigger HIGHLIGHT_DATA_POINT_EVENT if the data of a series is null`, () => {
                // @ts-ignore: Disabled for testing purposes
                mockSingleSeriesSet[0].data = null;
                const expectedDataPoint: IDataPoint = {
                    seriesId: mockSingleSeriesSet[0].id,
                    dataSeries: mockSingleSeriesSet[0],
                    index: DATA_POINT_INTERACTION_RESET,
                    data: null,
                    // @ts-ignore: Disabled for testing purposes
                    position: null,
                };

                dataManager.update(mockSingleSeriesSet);

                spyOn(renderEngine.rendererSubject, "next");
                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(renderEngine.rendererSubject.next).toHaveBeenCalledWith(<
                    IRendererEventPayload
                >{
                    eventName: HIGHLIGHT_DATA_POINT_EVENT,
                    data: expectedDataPoint,
                });
            });

            it(`should not trigger HIGHLIGHT_DATA_POINT_EVENT nor the interactionDataPointsSubject if the dataIndex
                is undefined for the highlighted value`, () => {
                dataManager.update(mockSingleSeriesSet);

                const getDataPointIndexSpy = spyOn(
                    mockSingleSeriesSet[0].renderer,
                    "getDataPointIndex"
                );
                // @ts-ignore: Disabled for testing purposes
                getDataPointIndexSpy.and.returnValue(undefined);
                spyOn(renderEngine.rendererSubject, "next");
                spyOn(renderEngine.interactionDataPointsSubject, "next");
                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(
                    renderEngine.rendererSubject.next
                ).not.toHaveBeenCalled();
                expect(
                    renderEngine.interactionDataPointsSubject.next
                ).not.toHaveBeenCalled();
            });

            it(`should not trigger HIGHLIGHT_DATA_POINT_EVENT nor the interactionDataPointsSubject if the new dataIndex
                is the same as the previous dataIndex`, () => {
                dataManager.update(mockSingleSeriesSet);

                const getDataPointIndexSpy = spyOn(
                    mockSingleSeriesSet[0].renderer,
                    "getDataPointIndex"
                );
                getDataPointIndexSpy.and.returnValue(1);
                spyOn(renderEngine.rendererSubject, "next");
                spyOn(renderEngine.interactionDataPointsSubject, "next");
                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(renderEngine.rendererSubject.next).toHaveBeenCalledTimes(
                    1
                );
                expect(
                    renderEngine.interactionDataPointsSubject.next
                ).toHaveBeenCalledTimes(1);
            });

            it(`should not trigger HIGHLIGHT_DATA_POINT_EVENT nor the interactionDataPointsSubject if the dataIndex
                is undefined for the highlighted value`, () => {
                dataManager.update(mockSingleSeriesSet);

                const getDataPointIndexSpy = spyOn(
                    mockSingleSeriesSet[0].renderer,
                    "getDataPointIndex"
                );
                // @ts-ignore: Disabled for testing purposes
                getDataPointIndexSpy.and.returnValue(undefined);
                spyOn(renderEngine.rendererSubject, "next");
                spyOn(renderEngine.interactionDataPointsSubject, "next");
                renderEngine.emitInteractionDataPoints({
                    interactionType: InteractionType.MouseMove,
                    values: {},
                });
                expect(
                    renderEngine.rendererSubject.next
                ).not.toHaveBeenCalled();
                expect(
                    renderEngine.interactionDataPointsSubject.next
                ).not.toHaveBeenCalled();
            });
        });

        describe("highlightDataPoint >", () => {
            it(`should invoke the highlightDataPoint method of the correct renderer`, () => {
                spyOn(mockDoubleSeriesSet[0].renderer, "highlightDataPoint");
                spyOn(mockDoubleSeriesSet[1].renderer, "highlightDataPoint");
                renderEngine.highlightDataPoint(mockDoubleSeriesSet[1].id, 1);
                expect(
                    mockDoubleSeriesSet[0].renderer.highlightDataPoint
                ).not.toHaveBeenCalled();
                expect(
                    mockDoubleSeriesSet[1].renderer.highlightDataPoint
                ).toHaveBeenCalled();
            });
        });

        describe("setSeriesStates >", () => {
            it(`should apply the correct styling attribute values to the container of the specified series`, () => {
                const seriesContainer = getSeriesContainer(
                    RenderLayerName.data,
                    mockDoubleSeriesSet[1].id
                );
                expect(seriesContainer.attr("visibility")).toBeNull();
                renderEngine.setSeriesStates([
                    {
                        seriesId: mockDoubleSeriesSet[1].id,
                        state: RenderState.hidden,
                    },
                ]);
                expect(seriesContainer.attr("visibility")).toEqual("hidden");
            });

            it(`should invoke renderer.setSeriesState only for the specified series`, () => {
                spyOn(mockDoubleSeriesSet[0].renderer, "setSeriesState");
                spyOn(mockDoubleSeriesSet[1].renderer, "setSeriesState");
                renderEngine.setSeriesStates([
                    {
                        seriesId: mockDoubleSeriesSet[1].id,
                        state: RenderState.hidden,
                    },
                ]);
                expect(
                    mockDoubleSeriesSet[0].renderer.setSeriesState
                ).not.toHaveBeenCalled();
                expect(
                    mockDoubleSeriesSet[1].renderer.setSeriesState
                ).toHaveBeenCalled();
            });
        });

        describe("destroy >", () => {
            it(`should unsubscribe the highlightDataPointSubscription`, () => {
                (renderEngine as any).highlightDataPointSubscription =
                    new Subscription();
                spyOn(
                    (renderEngine as any).highlightDataPointSubscription,
                    "unsubscribe"
                );
                renderEngine.destroy();
                expect(
                    (renderEngine as any).highlightDataPointSubscription
                        .unsubscribe
                ).toHaveBeenCalled();
            });
        });
    });
});
