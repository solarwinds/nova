import { INTERACTION_COORDINATES_EVENT, INTERACTION_VALUES_ACTIVE_EVENT, SET_DOMAIN_EVENT } from "../../constants";
import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { Chart } from "../chart";
import { LinearScale } from "../common/scales/linear-scale";
import { IAccessors, IChartSeries, InteractionType } from "../common/types";
import { XYGridConfig } from "../grid/config/xy-grid-config";
import { Grid } from "../grid/grid";
import { XYGrid } from "../grid/xy-grid";

import { ZoomPlugin } from "./zoom-plugin";

describe("ZoomPlugin >", () => {
    let plugin: ZoomPlugin;
    let xScale: LinearScale;
    let seriesSet: IChartSeries<IAccessors<any>>[];
    const xScaleId = "testId";

    beforeEach(() => {
        plugin = new ZoomPlugin();
        const gridConfig = new XYGridConfig();
        gridConfig.dimension.width(5);
        plugin.chart = new Chart(new XYGrid(gridConfig));
        plugin.chart.build(document.createElement("div"));
        plugin.initialize();
        xScale = new LinearScale(xScaleId);

        seriesSet = [
            {
                id: "series1",
                name: "Series 1",
                data: [
                    {
                        x: 0,
                        y: 0,
                    },
                    {
                        x: 1,
                        y: 1,
                    },
                    {
                        x: 2,
                        y: 2,
                    },
                    {
                        x: 3,
                        y: 3,
                    },
                    {
                        x: 4,
                        y: 4,
                    },
                    {
                        x: 5,
                        y: 5,
                    },
                ],
                renderer: new LineRenderer(),
                accessors: new LineAccessors(),
                scales: {
                    x: xScale,
                    y: new LinearScale(),
                },
            },
        ];

        plugin.chart.update(seriesSet);
        plugin.updateDimensions();
    });

    it("should define a brush element", () => {
        expect((<any>plugin).zoomBrushLayer.select(".brush")).toBeDefined();
    });

    describe("configuration", () => {
        it("should have the correct default values", () => {
            expect(plugin.config.enableExternalEvents).toEqual(false);
        });
    });

    describe("mouse interactions >", () => {
        describe("INTERACTION_COORDINATES_EVENT observer", () => {
            it("should short-circuit if the event is broadcast and 'enableExternalEvents' is 'false'", () => {
                plugin.config.enableExternalEvents = false;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: 5, y: 5 } },
                    broadcast: true,
                });

                expect((<any>plugin).brushStartX).toBeUndefined();
            });

            it("should not short-circuit if the event is not broadcast and 'enableExternalEvents' is 'false'", () => {
                const expectedBrushStart = 5;
                plugin.config.enableExternalEvents = false;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                    broadcast: false,
                });

                expect((<any>plugin).brushStartX).toEqual(expectedBrushStart);
            });

            it("should not short-circuit if the event is not broadcast and 'enableExternalEvents' is 'true'", () => {
                const expectedBrushStart = 5;
                plugin.config.enableExternalEvents = true;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                    broadcast: false,
                });

                expect((<any>plugin).brushStartX).toEqual(expectedBrushStart);
            });

            it("should not short-circuit if the event is broadcast and 'enableExternalEvents' is 'true'", () => {
                const expectedBrushStart = 5;
                plugin.config.enableExternalEvents = true;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                    broadcast: true,
                });

                expect((<any>plugin).brushStartX).toEqual(expectedBrushStart);
            });
        });


        describe("mousedown", () => {
            it("should set the brush start value", () => {
                const expectedBrushStart = 5;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                });

                expect((<any>plugin).brushStartX).toEqual(expectedBrushStart);
            });

            it("should not set the brush start value if it's already set", () => {
                const expectedBrushStart = 5;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                });

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart + 1, y: 5 } },
                });

                expect((<any>plugin).brushStartX).toEqual(expectedBrushStart);
            });

            it("should emit the INTERACTION_VALUES_ACTIVE_EVENT", () => {
                const expectedBrushStart = 5;
                const spy = spyOn(plugin.chart.getEventBus().getStream(INTERACTION_VALUES_ACTIVE_EVENT), "next");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                });

                expect(spy).toHaveBeenCalledWith({ data: false });
            });
        });

        describe("mousemove", () => {
            it("should move the brush", () => {
                const expectedBrushStart = 5;
                const expectedBrushMovement = 10;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                });

                const spy = spyOn((<any>plugin).brush, "move");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: expectedBrushMovement, y: 5 } },
                });

                expect(spy).toHaveBeenCalledWith((<any>plugin).brushElement, [expectedBrushStart, expectedBrushMovement]);
            });

            it("should not move the brush if the start value is unset", () => {
                const spy = spyOn((<any>plugin).brush, "move");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: 10, y: 5 } },
                });

                expect(spy).not.toHaveBeenCalled();
            });

            it("should invert the selection if the mouse moves to the left instead of to the right", () => {
                const expectedBrushStart = 5;
                const expectedBrushMovement = 2;
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 5 } },
                });

                const spy = spyOn((<any>plugin).brush, "move");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: expectedBrushMovement, y: 5 } },
                });

                expect(spy).toHaveBeenCalledWith((<any>plugin).brushElement, [expectedBrushMovement, expectedBrushStart]);
            });
        });

        describe("mouseup", () => {
            it("should set a new domain on the chart", () => {
                const expectedBrushStart = 2;
                const expectedBrushMovement = 4;
                const expectedDomain = [xScale.invert(expectedBrushStart), xScale.invert(expectedBrushMovement + Grid.RENDER_AREA_WIDTH_CORRECTION)];

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 2 } },
                });

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: expectedBrushMovement, y: 2 } },
                });

                const spy = spyOn(plugin.chart.getEventBus().getStream(SET_DOMAIN_EVENT), "next");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseUp, coordinates: { x: expectedBrushMovement, y: 2 } },
                });

                expect(spy).toHaveBeenCalledWith({ data: { [xScaleId]: expectedDomain } });
            });

            it("should not set a new domain on the chart if the start value is unset", () => {
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: 4, y: 2 } },
                });

                const spy = spyOn(plugin.chart.getEventBus().getStream(SET_DOMAIN_EVENT), "next");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseUp, coordinates: { x: 4, y: 2 } },
                });

                expect(spy).not.toHaveBeenCalled();
            });

            it("should not set a new domain on the chart if the selection has a width of zero", () => {
                const expectedBrushStart = 2;
                const expectedBrushMovement = 2;

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: expectedBrushStart, y: 2 } },
                });

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: expectedBrushMovement, y: 2 } },
                });

                const spy = spyOn(plugin.chart.getEventBus().getStream(SET_DOMAIN_EVENT), "next");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseUp, coordinates: { x: expectedBrushMovement, y: 2 } },
                });

                expect(spy).not.toHaveBeenCalled();
            });

            it("should emit the INTERACTION_VALUES_ACTIVE_EVENT", () => {
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: 2, y: 2 } },
                });

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: 4, y: 2 } },
                });

                const spy = spyOn(plugin.chart.getEventBus().getStream(INTERACTION_VALUES_ACTIVE_EVENT), "next");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseUp, coordinates: { x: 4, y: 2 } },
                });

                expect(spy).toHaveBeenCalledWith({ data: true });
            });

            it("should reset the brush start value", () => {
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: 2, y: 2 } },
                });
                expect((<any>plugin).brushStartX).toEqual(2);

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: 4, y: 2 } },
                });

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseUp, coordinates: { x: 4, y: 2 } },
                });

                expect((<any>plugin).brushStartX).toBeUndefined();
            });

            it("should remove the brush visualization", () => {
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseDown, coordinates: { x: 2, y: 2 } },
                });

                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseMove, coordinates: { x: 4, y: 2 } },
                });

                const spy = spyOn((<any>plugin).brush, "move");
                plugin.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: InteractionType.MouseUp, coordinates: { x: 4, y: 2 } },
                });

                expect(spy).toHaveBeenCalledWith((<any>plugin).brushElement, null);
            });
        });
    });

    describe("updateDimensions > ", () => {
        it("should set the brush area's dimensions", () => {
            const dimension = plugin.chart.getGrid().config().dimension;
            dimension.width(25);
            const spy = spyOn((<any>plugin).brush, "extent").and.callThrough();
            plugin.updateDimensions();
            expect(spy).toHaveBeenCalledWith([[0, 0], [dimension.width(), dimension.height()]]);
        });

        it("should trigger the rendering of the brush area", () => {
            const spy = spyOn((<any>plugin), "brush");
            plugin.updateDimensions();
            expect(spy).toHaveBeenCalledWith((<any>plugin).zoomBrushLayer.select(".brush"));
        });

        it("should disable pointer-events on the brush overlay", () => {
            plugin.updateDimensions();
            expect((<any>plugin).zoomBrushLayer.select(".overlay").node().attributeStyleMap.get("pointer-events").toString()).toEqual("none");
        });

        it("should remove the stroke value on the selection node", () => {
            plugin.updateDimensions();
            expect((<any>plugin).zoomBrushLayer.select(".selection").attr("stroke")).toBeNull();
        });
    });
});
