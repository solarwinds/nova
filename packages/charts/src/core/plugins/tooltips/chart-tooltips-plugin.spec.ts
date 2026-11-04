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

import { fakeAsync, tick } from "@angular/core/testing";

import { ChartTooltipsPlugin } from "./chart-tooltips-plugin";
import {
    DATA_POINT_INTERACTION_RESET,
    INTERACTION_DATA_POINTS_EVENT,
    SERIES_STATE_CHANGE_EVENT,
} from "../../../constants";
import { LineAccessors } from "../../../renderers/line/line-accessors";
import { LineRenderer } from "../../../renderers/line/line-renderer";
import { RenderState } from "../../../renderers/types";
import { Chart } from "../../chart";
import {
    IAccessors,
    IChartSeries,
    IInteractionDataPointsEvent,
    IDataPointsPayload,
    InteractionType,
    IRenderStateData,
} from "../../common/types";
import { IGrid } from "../../grid/types";
import { XYGrid } from "../../grid/xy-grid";

describe("ChartTooltipsPlugin >", () => {
    let grid: IGrid;
    let chart: Chart;
    let plugin: ChartTooltipsPlugin;
    let pluginTopOriented: ChartTooltipsPlugin;
    let offsetParentSpy: jasmine.Spy;

    beforeEach(() => {
        grid = new XYGrid();

        chart = new Chart(grid);

        plugin = new ChartTooltipsPlugin();
        (<any>plugin).isChartInView = true;
        pluginTopOriented = new ChartTooltipsPlugin(50, "top");
        (<any>pluginTopOriented).isChartInView = true;

        chart.addPlugin(plugin);
        chart.addPlugin(pluginTopOriented);

        const element = document.createElement("div");
        offsetParentSpy = spyOnProperty(element, "offsetParent");
        offsetParentSpy.and.returnValue({
            getBoundingClientRect: () => ({ top: 0, left: 0 }),
        });
        chart.build(element);
    });

    it("should not attempt to process data points for an interaction type other than mousemove", () => {
        spyOn(plugin, "processHighlightedDataPoints");
        chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            .next({
                data: {
                    interactionType: InteractionType.Click,
                    dataPoints: {},
                },
            });

        expect(plugin.processHighlightedDataPoints).not.toHaveBeenCalled();
    });

    it("calculates data point position", () => {
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
                    x: x,
                    y: y,
                    height: 0,
                    width: 0,
                },
            },
        };

        const testOffsetParentValue = 5;
        offsetParentSpy.and.returnValue({
            getBoundingClientRect: () => ({
                top: testOffsetParentValue,
                left: testOffsetParentValue,
            }),
        });

        chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            .next({
                data: {
                    interactionType: InteractionType.MouseMove,
                    dataPoints,
                },
            });

        const pointPosition = plugin.dataPointPositions["series-1"];

        expect(pointPosition).toBeDefined();
        expect(pointPosition.x).toBe(
            x +
                chart.getGrid().config().dimension.margin.left -
                testOffsetParentValue
        );
        expect(pointPosition.y).toBe(
            y +
                chart.getGrid().config().dimension.margin.top -
                testOffsetParentValue
        );

        expect(pointPosition.overlayPositions.length).toBe(2);
    });

    it("calculates data point position for top oriented tooltips and return correct ConnectedPosition", () => {
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
                    x: x,
                    y: y,
                    height: 50,
                    width: 50,
                },
            },
        };

        const testOffsetParentValue = 5;
        offsetParentSpy.and.returnValue({
            getBoundingClientRect: () => ({
                top: testOffsetParentValue,
                left: testOffsetParentValue,
            }),
        });

        chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            .next({
                data: {
                    interactionType: InteractionType.MouseMove,
                    dataPoints,
                },
            });

        const pointPosition = pluginTopOriented.dataPointPositions["series-1"];

        expect(pointPosition).toBeDefined();
        expect(pointPosition.overlayPositions).toEqual([
            {
                originX: "end",
                originY: "top",
                overlayX: "center",
                overlayY: "bottom",
                offsetY: -50,
            },
            {
                originX: "end",
                originY: "bottom",
                overlayX: "center",
                overlayY: "top",
                offsetY: 50,
            },
        ]);
        expect(pointPosition.x).toBe(
            x +
                chart.getGrid().config().dimension.margin.left -
                testOffsetParentValue
        );
        expect(pointPosition.y).toBe(
            y +
                chart.getGrid().config().dimension.margin.top -
                testOffsetParentValue
        );

        expect(pointPosition.overlayPositions.length).toBe(2);
    });

    describe("INTERACTION_DATA_POINTS_EVENT", () => {
        it("does not trigger show subject if the chart is not in view", fakeAsync(() => {
            const dataPoints: IDataPointsPayload = {
                "series-1": {
                    index: 1,
                    seriesId: "series-1",
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    data: {},
                    position: {
                        x: 100,
                        y: 100,
                        height: 0,
                        width: 0,
                    },
                },
            };

            const showSpy = spyOn(plugin.showSubject, "next");
            (<any>plugin).isChartInView = false;

            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        dataPoints,
                    },
                });

            tick();

            expect(showSpy).not.toHaveBeenCalled();
        }));

        it("triggers show subject if valid data points are provided and the chart is in view", fakeAsync(() => {
            const dataPoints: IDataPointsPayload = {
                "series-1": {
                    index: 1,
                    seriesId: "series-1",
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    data: {},
                    position: {
                        x: 100,
                        y: 100,
                        height: 0,
                        width: 0,
                    },
                },
            };

            const showSpy = spyOn(plugin.showSubject, "next");
            (<any>plugin).isChartInView = true;

            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        dataPoints,
                    },
                });

            tick();

            expect(showSpy).toHaveBeenCalledTimes(1);
        }));

        it("does not trigger hide subject if no valid data points are provided but the chart is not in view", fakeAsync(() => {
            const dataPoints: IDataPointsPayload = {
                "series-1": {
                    index: -1,
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    seriesId: "series-1",
                    data: {},
                    position: undefined,
                },
            };

            const showSpy = spyOn(plugin.hideSubject, "next");
            (<any>plugin).isChartInView = false;

            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        dataPoints,
                    },
                });

            tick();

            expect(showSpy).not.toHaveBeenCalled();
        }));

        it("triggers hide subject if no valid data points were provided and the chart is in view", fakeAsync(() => {
            const dataPoints: IDataPointsPayload = {
                "series-1": {
                    index: -1,
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    seriesId: "series-1",
                    data: {},
                    position: undefined,
                },
            };

            const showSpy = spyOn(plugin.hideSubject, "next");
            (<any>plugin).isChartInView = true;

            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        dataPoints,
                    },
                });

            tick();

            expect(showSpy).toHaveBeenCalledTimes(1);
        }));

        it("sets the property 'dataPoints' with only the visible series's data points", () => {
            const visibleId: string = "visibleId";
            const hiddenId: string = "hiddenId";
            const dataPoints = {
                [visibleId]: {
                    index: 1,
                    seriesId: visibleId,
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    data: {},
                    position: {
                        x: 100,
                        y: 100,
                        height: 0,
                        width: 0,
                    },
                },
                [hiddenId]: {
                    index: 2,
                    seriesId: hiddenId,
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    data: {},
                    position: {
                        x: 100,
                        y: 100,
                        height: 0,
                        width: 0,
                    },
                },
            };
            const seriesStates = <IRenderStateData[]>[
                {
                    seriesId: visibleId,
                    state: RenderState.default,
                },
                {
                    seriesId: hiddenId,
                    state: RenderState.hidden,
                },
            ];

            (<any>plugin).isChartInView = true;

            chart
                .getEventBus()
                .getStream(SERIES_STATE_CHANGE_EVENT)
                .next({ data: seriesStates });

            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        dataPoints,
                    },
                });

            expect(plugin.dataPoints[visibleId]).toBeTruthy();
            expect(plugin.dataPoints[hiddenId]).toBeUndefined();
        });
    });

    describe("keyboard tooltip navigation", () => {
        const createSeries = (
            id: string,
            data: object[],
            position?: {
                x: number;
                y: number;
                width?: number;
                height?: number;
            }
        ): IChartSeries<IAccessors> => {
            const renderer = new LineRenderer();
            spyOn(renderer, "getDataPointPosition").and.returnValue(position);
            return {
                id,
                data,
                scales: {},
                accessors: new LineAccessors(),
                renderState: RenderState.default,
                renderer,
            };
        };

        const setSeriesAndVisibility = (
            series: IChartSeries<IAccessors>[]
        ): void => {
            chart.getDataManager().update(series);
            chart
                .getEventBus()
                .getStream(SERIES_STATE_CHANGE_EVENT)
                .next({
                    data: series.map(item => ({
                        seriesId: item.id,
                        state: item.renderState,
                    })),
                });
        };

        it("counts the longest visible series and excludes series hidden by render state", () => {
            const shortSeries = createSeries("short", [{}, {}]);
            const longSeries = createSeries("long", [{}, {}, {}, {}]);
            const hiddenSeries = createSeries("hidden", [
                {},
                {},
                {},
                {},
                {},
                {},
            ]);
            hiddenSeries.renderState = RenderState.hidden;
            setSeriesAndVisibility([shortSeries, longSeries, hiddenSeries]);

            expect(plugin.getKeyboardDataPointCount()).toBe(4);
        });

        it("returns zero when no visible series has data points", () => {
            const emptySeries = createSeries("empty", []);
            const hiddenSeries = createSeries("hidden", [{}]);
            hiddenSeries.renderState = RenderState.hidden;
            setSeriesAndVisibility([emptySeries, hiddenSeries]);

            expect(plugin.getKeyboardDataPointCount()).toBe(0);
        });

        it("uses visible renderer geometry, skips invalid points, and emits keyboard data", () => {
            const visible = createSeries("visible", [{}, {}], {
                x: 10,
                y: 20,
                width: 3,
                height: 4,
            });
            const missing = createSeries("missing", [{}, {}], undefined);
            const nonFinite = createSeries("non-finite", [{}, {}], {
                x: Number.NaN,
                y: 5,
            });
            const hidden = createSeries("hidden", [{}, {}], {
                x: 30,
                y: 40,
            });
            hidden.renderState = RenderState.hidden;
            setSeriesAndVisibility([visible, missing, nonFinite, hidden]);

            const highlightSpy = spyOn(
                chart.getRenderEngine(),
                "highlightDataPoint"
            );
            const events: IInteractionDataPointsEvent[] = [];
            chart
                .getEventBus()
                .getStream(INTERACTION_DATA_POINTS_EVENT)
                .subscribe(event => events.push(event.data));
            const showSpy = spyOn(plugin.showSubject, "next");

            plugin.showForIndex(1);

            expect(visible.renderer.getDataPointPosition).toHaveBeenCalledWith(
                visible,
                1,
                visible.scales
            );
            expect(missing.renderer.getDataPointPosition).toHaveBeenCalled();
            expect(nonFinite.renderer.getDataPointPosition).toHaveBeenCalled();
            expect(hidden.renderer.getDataPointPosition).not.toHaveBeenCalled();
            expect(highlightSpy).toHaveBeenCalledOnceWith("visible", 1);
            expect(plugin.dataPoints).toEqual({
                visible: {
                    seriesId: "visible",
                    dataSeries: visible,
                    index: 1,
                    data: visible.data[1],
                    position: {
                        x: 10,
                        y: 20,
                        width: 3,
                        height: 4,
                    },
                },
            });
            expect(events[0]).toEqual({
                interactionType: InteractionType.Keyboard,
                dataPoints: plugin.dataPoints,
            });
            expect(showSpy).toHaveBeenCalled();

            plugin.hideKeyboardTooltips();

            expect(highlightSpy.calls.mostRecent().args).toEqual([
                "visible",
                DATA_POINT_INTERACTION_RESET,
            ]);
            expect(events[1].interactionType).toBe(InteractionType.Keyboard);
            expect(events[1].dataPoints["visible"].index).toBe(
                DATA_POINT_INTERACTION_RESET
            );
            expect(events[1].dataPoints["hidden"]).toBeUndefined();
        });

        it("rejects indices outside the visible data range", () => {
            const series = createSeries("series", [{}]);
            setSeriesAndVisibility([series]);

            expect(() => plugin.showForIndex(-1)).toThrowError(RangeError);
            expect(() => plugin.showForIndex(1)).toThrowError(RangeError);
        });
    });
});
