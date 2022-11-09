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

import {
    CHART_VIEW_STATUS_EVENT,
    INTERACTION_VALUES_EVENT,
} from "../../../constants";
import { Chart } from "../../chart";
import { TimeScale } from "../../common/scales/time-scale";
import { InteractionType } from "../../common/types";
import { XYGrid } from "../../grid/xy-grid";
import { IInteractionValuesPayload } from "../types";
import { InteractionLinePlugin } from "./interaction-line-plugin";

describe("InteractionLinePlugin >", () => {
    let grid: XYGrid;
    let chart: Chart;
    let plugin: InteractionLinePlugin;
    let interactionLineLayer: InteractionLinePlugin["interactionLineLayer"];

    beforeEach(() => {
        grid = new XYGrid();

        chart = new Chart(grid);

        plugin = new InteractionLinePlugin();

        chart.addPlugin(plugin);

        const element = document.createElement("div");
        chart.build(element);

        interactionLineLayer = (<any>plugin).interactionLineLayer;
    });

    const setIsChartInView = (value: boolean) => {
        (<any>plugin).isChartInView = value;
    };

    const getIsChartInView = () => (<any>plugin).isChartInView;

    describe("INTERACTION_VALUES_EVENT", () => {
        it("should not trigger a line update if the chart is not in view", () => {
            const valuesPayload: IInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            const spy = spyOn(<any>plugin, "handleLineUpdate");
            (<any>plugin).isChartInView = false;

            chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_EVENT)
                .next({ data: valuesPayload });

            expect(spy).not.toHaveBeenCalled();
        });

        it("should trigger a line update if the chart is in view", () => {
            const valuesPayload: IInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            const spy = spyOn(<any>plugin, "handleLineUpdate");
            setIsChartInView(true);

            chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_EVENT)
                .next({ data: valuesPayload });

            expect(spy).toHaveBeenCalled();
        });

        it("should store the values payload", () => {
            const expectedStoredPayload: IInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_EVENT)
                .next({ data: expectedStoredPayload });

            expect((<any>plugin).lastInteractionValuesPayload).toBe(
                expectedStoredPayload
            );
        });

        describe("should trigger label update with correct xValue", () => {
            const value = {};

            let timeScale: TimeScale;
            let payload: IInteractionValuesPayload;
            let spyUpdateLine: jasmine.Spy;

            const trigger = () =>
                chart
                    .getEventBus()
                    .getStream(INTERACTION_VALUES_EVENT)
                    .next({ data: payload });

            beforeEach(() => {
                timeScale = new TimeScale();
                grid.scales = {
                    x: {
                        index: {
                            [timeScale.id]: timeScale,
                        },
                        list: [timeScale],
                    },
                };
                grid.bottomScaleId = timeScale.id;
                payload = {
                    interactionType: InteractionType.MouseMove,
                    values: {
                        x: {},
                    },
                };
                spyUpdateLine = spyOn(<any>plugin, "updateLine");
                setIsChartInView(true);
            });

            it("when scale from current graph", () => {
                payload.values.x[timeScale.id] = value;
                trigger();
                expect(spyUpdateLine).toHaveBeenCalledWith(
                    interactionLineLayer,
                    timeScale,
                    value
                );
            });

            it("when scale not from current graph", () => {
                grid.bottomScaleId = timeScale.id;
                payload.values.x["otherId"] = value;
                trigger();
                expect(spyUpdateLine).toHaveBeenCalledWith(
                    interactionLineLayer,
                    timeScale,
                    value
                );
            });
        });
    });

    describe("CHART_VIEW_STATUS_EVENT", () => {
        it("should update the view status", () => {
            setIsChartInView(true);

            chart
                .getEventBus()
                .getStream(CHART_VIEW_STATUS_EVENT)
                .next({ data: { isChartInView: false } });

            expect(getIsChartInView()).toEqual(false);
        });

        it("should trigger a line update when the chart enters view", () => {
            (<any>plugin).lastInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            const spy = spyOn(<any>plugin, "handleLineUpdate");
            setIsChartInView(false);

            chart
                .getEventBus()
                .getStream(CHART_VIEW_STATUS_EVENT)
                .next({ data: { isChartInView: true } });

            expect(spy).toHaveBeenCalled();
        });
    });
});
