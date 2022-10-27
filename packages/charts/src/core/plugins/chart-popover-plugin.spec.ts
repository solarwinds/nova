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

import { fakeAsync, flush } from "@angular/core/testing";
import { select } from "d3-selection";
import cloneDeep from "lodash/cloneDeep";

import {
    DATA_POINT_INTERACTION_RESET,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_DATA_POINT_EVENT,
} from "../../constants";
import { Chart } from "../chart";
import {
    IChartEvent,
    IDataPoint,
    IDataPointsPayload,
    IInteractionDataPointEvent,
    IInteractionDataPointsEvent,
    InteractionType,
} from "../common/types";
import { XYGridConfig } from "../grid/config/xy-grid-config";
import { IGrid, IGridConfig } from "../grid/types";
import { XYGrid } from "../grid/xy-grid";
import { ChartPopoverPlugin } from "./chart-popover-plugin";

describe("ChartPopoverPlugin >", () => {
    let grid: IGrid;
    let gridConfig: IGridConfig;
    let chart: Chart;
    let plugin: ChartPopoverPlugin;

    beforeEach(() => {
        grid = new XYGrid();
        gridConfig = new XYGridConfig();
        chart = new Chart(grid);

        // @ts-ignore: Disabled for testing purposes
        chart.target = select(document.createElement("div")).append("svg");
        plugin = new ChartPopoverPlugin();

        chart.addPlugin(plugin);
        chart.initialize();
    });

    describe("initialize", () => {
        it("should subscribe to the INTERACTION_DATA_POINTS_EVENT by default", fakeAsync(() => {
            const event: IChartEvent = {
                data: {
                    interactionType: InteractionType.MouseMove,
                    dataPoints: {
                        "series-1": {
                            index: 5,
                            position: { x: 400 },
                        } as IDataPoint,
                        "series-2": {
                            index: 5,
                            position: { x: 560 },
                        } as IDataPoint,
                    },
                } as IInteractionDataPointsEvent,
            };

            plugin.initialize();

            const spy = spyOn(plugin.openPopoverSubject, "next");
            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next(event);

            flush();

            expect(spy).toHaveBeenCalled();
        }));

        it("should subscribe to the configured event stream", fakeAsync(() => {
            const event: IChartEvent = {
                data: {
                    interactionType: InteractionType.MouseMove,
                    dataPoint: {
                        index: 5,
                        position: { x: 400 },
                    } as IDataPoint,
                } as IInteractionDataPointEvent,
            };

            plugin.config.eventStreamId = INTERACTION_DATA_POINT_EVENT;
            plugin.initialize();

            const spy = spyOn(plugin.openPopoverSubject, "next");
            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINT_EVENT)
                .next(event);

            flush();

            expect(spy).toHaveBeenCalled();
        }));

        it("should respond to the configured interaction type", fakeAsync(() => {
            const event: IChartEvent = {
                data: {
                    interactionType: InteractionType.Click,
                    dataPoint: {
                        index: 5,
                        position: { x: 400 },
                    } as IDataPoint,
                } as IInteractionDataPointEvent,
            };

            plugin.config.eventStreamId = INTERACTION_DATA_POINT_EVENT;
            plugin.config.interactionType = InteractionType.Click;
            plugin.initialize();

            const spy = spyOn(plugin.openPopoverSubject, "next");
            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINT_EVENT)
                .next(event);

            flush();

            expect(spy).toHaveBeenCalled();
        }));
    });

    describe("INTERACTION_DATA_POINTS_EVENT", () => {
        let interactionDataPointsEventPayload: IChartEvent;
        beforeEach(() => {
            interactionDataPointsEventPayload = {
                data: {
                    interactionType: InteractionType.MouseMove,
                    dataPoints: {
                        "series-1": {
                            index: 5,
                            position: { x: 400 },
                        },
                        "series-2": {
                            index: 5,
                            position: { x: 560 },
                        },
                    },
                },
            };
            gridConfig.dimension.margin.left = 30;
            grid.config(gridConfig);
        });

        it("should not attempt to process data points for an interaction type other than mousemove", () => {
            spyOn(<any>plugin, "processDataPoints");
            const testPayload = cloneDeep(interactionDataPointsEventPayload);
            testPayload.data.interactionType = InteractionType.Click;
            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next(testPayload);

            expect((<any>plugin).processDataPoints).not.toHaveBeenCalled();
        });

        it("should result in calculating the popover target position", () => {
            const parentNodeValues = {
                offsetTop: 10,
                offsetLeft: 10,
                offsetHeight: 200,
            };

            // @ts-ignore: Disabled for testing purposes
            spyOnProperty(chart.target?.node(), "parentNode").and.returnValue(
                parentNodeValues
            );
            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next(interactionDataPointsEventPayload);

            expect(plugin.popoverTargetPosition).toEqual({
                top: 10,
                left: 440,
                width: 160,
                height: 200,
            });
        });

        it("should result in populating the plugin's dataPoints member", () => {
            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next(interactionDataPointsEventPayload);
            expect(plugin.dataPoints).toEqual(
                interactionDataPointsEventPayload.data.dataPoints
            );
        });

        describe("open/close subjects", () => {
            it("should trigger the openPopoverSubject", fakeAsync(() => {
                spyOn(plugin.openPopoverSubject, "next");
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next(interactionDataPointsEventPayload);

                flush();

                expect(plugin.openPopoverSubject.next).toHaveBeenCalled();
            }));

            it(`should trigger the openPopoverSubject only once if the INTERACTION_DATA_POINTS_EVENT
                is received multiple times before closing the popover`, fakeAsync(() => {
                spyOn(plugin.openPopoverSubject, "next");
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next(interactionDataPointsEventPayload);
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next(interactionDataPointsEventPayload);

                flush();

                expect(plugin.openPopoverSubject.next).toHaveBeenCalledTimes(1);
            }));

            it("should not trigger the closePopoverSubject", () => {
                spyOn(plugin.closePopoverSubject, "next");
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next(interactionDataPointsEventPayload);

                expect(plugin.closePopoverSubject.next).not.toHaveBeenCalled();
            });

            it("should not trigger the openPopoverSubject", fakeAsync(() => {
                interactionDataPointsEventPayload.data.dataPoints[
                    "series-1"
                ].position = null;
                interactionDataPointsEventPayload.data.dataPoints[
                    "series-2"
                ].position = null;
                spyOn(plugin.openPopoverSubject, "next");
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next(interactionDataPointsEventPayload);

                flush();

                expect(plugin.openPopoverSubject.next).not.toHaveBeenCalled();
            }));

            it("should trigger the closePopoverSubject if the positions are null", fakeAsync(() => {
                interactionDataPointsEventPayload.data.dataPoints[
                    "series-1"
                ].position = null;
                interactionDataPointsEventPayload.data.dataPoints[
                    "series-2"
                ].position = null;
                spyOn(plugin.closePopoverSubject, "next");
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next(interactionDataPointsEventPayload);

                flush();

                expect(plugin.closePopoverSubject.next).toHaveBeenCalled();
            }));

            it("should trigger the closePopoverSubject if the data point index is DATA_POINT_INTERACTION_RESET", fakeAsync(() => {
                const event: IChartEvent = {
                    data: {
                        interactionType: InteractionType.MouseMove,
                        dataPoint: {
                            index: DATA_POINT_INTERACTION_RESET,
                            position: { x: 400 },
                        } as IDataPoint,
                    } as IInteractionDataPointEvent,
                };

                plugin.config.eventStreamId = INTERACTION_DATA_POINT_EVENT;
                plugin.initialize();
                spyOn(plugin.closePopoverSubject, "next");
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINT_EVENT)
                    .next(event);

                flush();

                expect(plugin.closePopoverSubject.next).toHaveBeenCalled();
            }));
        });

        describe("updatePositionSubject", () => {
            it("should emit", fakeAsync(() => {
                const spy = spyOn(plugin.updatePositionSubject, "next");

                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next(interactionDataPointsEventPayload);

                flush();

                expect(spy).toHaveBeenCalledWith(plugin.popoverTargetPosition);
            }));
        });
    });

    describe("cleanup", () => {
        it("should invoke complete on the open/close subjects", () => {
            spyOn(plugin.openPopoverSubject, "complete");
            spyOn(plugin.closePopoverSubject, "complete");

            plugin.destroy();

            expect(plugin.openPopoverSubject.complete).toHaveBeenCalled();
            expect(plugin.closePopoverSubject.complete).toHaveBeenCalled();
        });

        it("should unsubscribe from the configured chart event", () => {
            const expectedPosition = {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            };
            plugin.popoverTargetPosition = expectedPosition;

            const x = 100;
            const y = 100;

            const dataPoints: IDataPointsPayload = {
                "series-1": {
                    index: 1,
                    seriesId: "series-1",
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    data: {},
                    position: {
                        x,
                        y,
                        height: 0,
                        width: 0,
                    },
                },
            };

            plugin.destroy();
            chart
                .getEventBus()
                .getStream(plugin.config.eventStreamId as string)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        dataPoints,
                    },
                });

            expect(plugin.popoverTargetPosition).toEqual(expectedPosition);
        });
    });
});
