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

import { TestBed } from "@angular/core/testing";
import moment from "moment/moment";

import {
    INTERACTION_COORDINATES_EVENT,
    INTERACTION_VALUES_EVENT,
} from "../../constants";
import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { Chart } from "../chart";
import { LinearScale } from "../common/scales/linear-scale";
import {
    IAccessors,
    IChartEvent,
    IChartSeries,
    InteractionType,
} from "../common/types";
import { XYGridConfig } from "../grid/config/xy-grid-config";
import { XYGrid } from "../grid/xy-grid";
import { TimeScale } from "../public-api";
import { TimeseriesZoomPlugin } from "./timeseries-zoom-plugin";
import { TimeseriesZoomPluginsSyncService } from "./timeseries-zoom-plugin-sync.service";

describe("TimeseriesZoomPlugin >", () => {
    let plugin: TimeseriesZoomPlugin;
    let service: TimeseriesZoomPluginsSyncService;
    let xScale: LinearScale;
    let seriesSet: IChartSeries<IAccessors<any>>[];
    const gridWidth = 500;
    const xScaleId = "testId";
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeseriesZoomPluginsSyncService],
        });
        service = TestBed.inject(TimeseriesZoomPluginsSyncService);

        plugin = new TimeseriesZoomPlugin({}, service);
        const gridConfig = new XYGridConfig();
        gridConfig.dimension.width(gridWidth);
        plugin.chart = new Chart(new XYGrid(gridConfig));
        plugin.chart.build(document.createElement("div"));
        plugin.initialize();
        xScale = new LinearScale(xScaleId);

        seriesSet = [
            {
                id: "series1",
                name: "Series 1",
                data: [],
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
            expect(plugin.config.enableExternalEvents).toEqual(true);
        });
    });

    describe("mouse interactions >", () => {
        describe("INTERACTION_VALUES_EVENT", () => {
            let linearScaleX: LinearScale;
            let linearScaleY: LinearScale;
            beforeEach(() => {
                linearScaleX = new LinearScale("xAxis1");
                linearScaleY = new LinearScale("xAxis1");
                linearScaleX.isTimeseriesScale = true;
                plugin.chart.getGrid().scales = {
                    x: {
                        index: {
                            xAxis1: linearScaleX,
                        },
                        list: [linearScaleX],
                    },
                    y: {
                        index: {
                            yAxisId: linearScaleY,
                        },
                        list: [linearScaleY],
                    },
                };
            });

            it("should set isChartHoverd to true when hovering over the chart", () => {
                const valuesPayload: IChartEvent = {
                    data: {
                        interactionType: InteractionType.MouseMove,
                        values: { x: { xAxis1: 5 } },
                    },
                };

                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_VALUES_EVENT)
                    .next(valuesPayload);

                expect((<any>plugin).isChartHoverd).toBe(true);
            });

            it("should set isChartHoverd to false and close popover when hovering over different chart", () => {
                const valuesPayload: IChartEvent = {
                    data: {
                        interactionType: InteractionType.MouseMove,
                        values: { x: { xAxis2: 5 } },
                    },
                };

                const spy = spyOn(plugin, "closePopover");
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_VALUES_EVENT)
                    .next(valuesPayload);

                expect(spy).toHaveBeenCalled();
                expect((<any>plugin).isChartHoverd).toBe(false);
            });
        });

        describe("INTERACTION_COORDINATES_EVENT", () => {
            it("should short-circuit if the event is broadcast and 'enableExternalEvents' is 'false'", () => {
                plugin.config.enableExternalEvents = false;
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseDown,
                            coordinates: { x: 5, y: 5 },
                        },
                        broadcast: true,
                    });

                expect(plugin.getInspectionFrame().startDate).toBeUndefined();
            });
            it("should not short-circuit if the event is not broadcast and 'enableExternalEvents' is 'false'", () => {
                const expectedBrushStart = 5;
                plugin.config.enableExternalEvents = false;
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseDown,
                            coordinates: { x: expectedBrushStart, y: 5 },
                        },
                        broadcast: false,
                    });
                expect((<any>plugin).brushStartXCoord).toBe(expectedBrushStart);
            });
            it("should not short-circuit if the event is not broadcast and 'enableExternalEvents' is 'true'", () => {
                const expectedBrushStart = 5;
                plugin.config.enableExternalEvents = true;
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseDown,
                            coordinates: { x: expectedBrushStart, y: 5 },
                        },
                        broadcast: false,
                    });

                expect((<any>plugin).brushStartXCoord).toBe(expectedBrushStart);
            });
        });

        describe("mousedown", () => {
            it("should set the brush start values", () => {
                const expectedBrushStart = 5;
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseDown,
                            coordinates: { x: expectedBrushStart, y: 5 },
                        },
                    });

                expect((<any>plugin).brushStartXCoord).toEqual(
                    expectedBrushStart
                );
            });

            it("should not clear brush start value if it's already set and should set it to new value", () => {
                const stream = plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT);

                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: 5, y: 5 },
                    },
                });
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: 6, y: 5 },
                    },
                });

                expect((<any>plugin).brushStartXCoord).toEqual(6);
            });
        });

        describe("mousemove", () => {
            it("should move the brush", () => {
                const expectedBrushStart = 5;
                const expectedBrushMovement = 10;
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseDown,
                            coordinates: { x: expectedBrushStart, y: 5 },
                        },
                    });

                const spy = spyOn((<any>plugin).brush, "move");
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseMove,
                            coordinates: { x: expectedBrushMovement, y: 5 },
                        },
                    });

                expect(spy).toHaveBeenCalledWith((<any>plugin).brushElement, [
                    expectedBrushStart,
                    expectedBrushMovement,
                ]);
            });

            it("should not move the brush if the start value is undefined", () => {
                const spy = spyOn((<any>plugin).brush, "move");
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseMove,
                            coordinates: { x: 10, y: 5 },
                        },
                    });

                expect(spy).not.toHaveBeenCalled();
            });

            it("should emit openPopover if hovering over displayed brush", () => {
                (<any>plugin).isChartHoverd = true;
                (<any>plugin).isPopoverDisplayed = false;
                const openPopoverSpy = jasmine.createSpy();
                const closePopoverSpy = jasmine.createSpy();
                plugin.openPopover$.subscribe(openPopoverSpy);
                plugin.closePopover$.subscribe(closePopoverSpy);

                const stream = plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT);
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: 5, y: 5 },
                    },
                });
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        coordinates: { x: 10, y: 5 },
                    },
                });
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseUp,
                        coordinates: { x: 10, y: 5 },
                    },
                });

                stream.next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        coordinates: { x: 6, y: 5 },
                    },
                });

                expect(openPopoverSpy).toHaveBeenCalled();
                expect(closePopoverSpy).not.toHaveBeenCalled();
            });

            it("should emit closePopover if hovering outside displayed brush", () => {
                (<any>plugin).isPopoverDisplayed = true;
                const closePopoverSpy = jasmine.createSpy();
                plugin.closePopover$.subscribe(closePopoverSpy);

                const stream = plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT);
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: 5, y: 5 },
                    },
                });
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        coordinates: { x: 10, y: 5 },
                    },
                });
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseUp,
                        coordinates: { x: 10, y: 5 },
                    },
                });

                stream.next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        coordinates: { x: 2, y: 5 },
                    },
                });
                expect(closePopoverSpy).toHaveBeenCalled();
            });
        });

        describe("mouseup", () => {
            it("should set the brush start values", () => {
                const expectedBrushEnd = 10;

                const stream = plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT);

                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: 5, y: 5 },
                    },
                });
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseUp,
                            coordinates: { x: expectedBrushEnd, y: 5 },
                        },
                    });
                expect((<any>plugin).brushEndXCoord).toEqual(expectedBrushEnd);
            });

            it("should correctly reverse the values if dragging from right to left", () => {
                const brushStart = 10;
                const brushEnd = 5;

                const stream = plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT);

                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: brushStart, y: 5 },
                    },
                });
                plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT)
                    .next({
                        data: {
                            interactionType: InteractionType.MouseUp,
                            coordinates: { x: brushEnd, y: 5 },
                        },
                    });
                expect((<any>plugin).brushStartXCoord).toEqual(brushEnd);
                expect((<any>plugin).brushEndXCoord).toEqual(brushStart);
            });

            it("should emit zoomCreated when brushEnd is completed on hovered chart", () => {
                (<any>plugin).isChartHoverd = true;
                const zoomCreadedSpy = jasmine.createSpy();
                plugin.zoomCreated$.subscribe(zoomCreadedSpy);

                const stream = plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT);
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: 5, y: 5 },
                    },
                });

                stream.next({
                    data: {
                        interactionType: InteractionType.MouseUp,
                        coordinates: { x: 10, y: 5 },
                    },
                });

                expect(zoomCreadedSpy).toHaveBeenCalled();
            });

            it("should not emit zoomCreated when brushEnd is completed on non-hovered chart", () => {
                (<any>plugin).isChartHoverd = false;
                const zoomCreadedSpy = jasmine.createSpy();
                plugin.zoomCreated$.subscribe(zoomCreadedSpy);

                const stream = plugin.chart
                    .getEventBus()
                    .getStream(INTERACTION_COORDINATES_EVENT);
                stream.next({
                    data: {
                        interactionType: InteractionType.MouseDown,
                        coordinates: { x: 5, y: 5 },
                    },
                });

                stream.next({
                    data: {
                        interactionType: InteractionType.MouseUp,
                        coordinates: { x: 10, y: 5 },
                    },
                });

                expect(zoomCreadedSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe("updateDimensions > ", () => {
        it("should set the brush area's dimensions", () => {
            const dimension = plugin.chart.getGrid().config().dimension;
            dimension.width(25);
            const spy = spyOn((<any>plugin).brush, "extent").and.callThrough();
            plugin.updateDimensions();
            expect(spy).toHaveBeenCalledWith([
                [0, 0],
                [dimension.width(), dimension.height()],
            ]);
        });

        it("should trigger the rendering of the brush area", () => {
            const spy = spyOn(<any>plugin, "brush");
            plugin.updateDimensions();
            expect(spy).toHaveBeenCalledWith(
                (<any>plugin).zoomBrushLayer.select(".brush")
            );
        });

        it("should disable pointer-events on the brush overlay", () => {
            plugin.updateDimensions();
            expect(
                (<any>plugin).zoomBrushLayer
                    .select(".overlay")
                    .node()
                    .attributeStyleMap.get("pointer-events")
                    .toString()
            ).toEqual("none");
        });

        it("should remove the stroke value on the selection node", () => {
            plugin.updateDimensions();
            expect(
                (<any>plugin).zoomBrushLayer.select(".selection").attr("stroke")
            ).toBeNull();
        });
    });

    describe("moving brush to new location >", () => {
        beforeEach(() => {
            const xTimeScale = new TimeScale("timescale");
            const scaleStartDate = moment(
                "2023-02-10T16:00:00.909Z",
                format
            ).toDate();
            const sxaleEndDate = moment(
                "2023-02-11T16:00:00.909Z",
                format
            ).toDate();
            xTimeScale.fixDomain([scaleStartDate, sxaleEndDate]);
            seriesSet = [
                {
                    id: "series1",
                    name: "Series 1",
                    data: [],
                    renderer: new LineRenderer(),
                    accessors: new LineAccessors(),
                    scales: {
                        x: xTimeScale,
                        y: new LinearScale(),
                    },
                },
            ];
            plugin.chart.update(seriesSet);
            plugin.updateDimensions();
        });
        describe("moveBrushByDate()", () => {
            it("it should move the brush to the given time range", () => {
                const timeFrameStart = moment(
                    "2023-02-10T18:00:00.909Z",
                    format
                );
                const timeFrameEnd = moment("2023-02-10T20:00:00.909Z", format);
                plugin.moveBrushByDate(timeFrameStart, timeFrameEnd);

                expect(Math.floor((<any>plugin).brushStartXCoord)).toEqual(41);
                expect(Math.floor((<any>plugin).brushEndXCoord)).toEqual(83);

                expect((<any>plugin).brushStartXDate.toISOString()).toEqual(
                    timeFrameStart.toISOString()
                );
                expect((<any>plugin).brushEndXDate.toISOString()).toEqual(
                    timeFrameEnd.toISOString()
                );
            });
        });

        describe("moveBrushByDate()", () => {
            it("it should move the brush to the given coordinates", () => {
                const expectedBrushStart = 100;
                const expectedBrushEnd = 150;

                plugin.moveBrushByCoord(expectedBrushStart, expectedBrushEnd);

                expect((<any>plugin).brushStartXCoord).toEqual(
                    expectedBrushStart
                );
                expect((<any>plugin).brushEndXCoord).toEqual(expectedBrushEnd);

                expect((<any>plugin).brushStartXDate.toISOString()).toEqual(
                    "2023-02-10T20:48:00.000Z"
                );
                expect((<any>plugin).brushEndXDate.toISOString()).toEqual(
                    "2023-02-10T23:12:00.000Z"
                );
            });
        });
    });
});
