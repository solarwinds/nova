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
} from "../../constants";
import { Chart } from "../chart";
import { RenderEnginePlugin } from "./render-engine-plugin";
import { IInteractionValuesPayload } from "./types";
import { InteractionType } from "../common/types";
import { IGrid } from "../grid/types";
import { XYGrid } from "../grid/xy-grid";

describe("RenderEnginePlugin >", () => {
    let grid: IGrid;
    let chart: Chart;
    let plugin: RenderEnginePlugin;
    let chartElement: HTMLDivElement;

    beforeAll(() => {
        chartElement = document.createElement("div");
    });

    beforeEach(() => {
        grid = new XYGrid();

        chart = new Chart(grid);
        chart.build(chartElement);
        // remove the plugin that gets added by default
        chart.removePlugin(RenderEnginePlugin);

        plugin = new RenderEnginePlugin();
        (<any>plugin).isChartInView = true;

        chart.addPlugin(plugin);
        plugin.initialize();
    });

    describe("INTERACTION_VALUES_EVENT", () => {
        it("should not emit interaction data points if the chart is not in view", () => {
            const valuesPayload: IInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            (<any>plugin).isChartInView = false;

            const spy = spyOn(
                chart.getRenderEngine(),
                "emitInteractionDataPoints"
            );
            chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_EVENT)
                .next({ data: valuesPayload });

            expect(spy).not.toHaveBeenCalled();
        });

        it("should emit interaction data points if the chart is in view", () => {
            const valuesPayload: IInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            (<any>plugin).isChartInView = true;

            const spy = spyOn(
                chart.getRenderEngine(),
                "emitInteractionDataPoints"
            );
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
    });

    describe("CHART_VIEW_STATUS_EVENT", () => {
        it("should update the view status", () => {
            (<any>plugin).isChartInView = true;

            chart
                .getEventBus()
                .getStream(CHART_VIEW_STATUS_EVENT)
                .next({ data: { isChartInView: false } });

            expect((<any>plugin).isChartInView).toEqual(false);
        });

        it("should emit interaction data points when the chart enters the view", () => {
            (<any>plugin).lastInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            (<any>plugin).isChartInView = false;

            const spy = spyOn(
                chart.getRenderEngine(),
                "emitInteractionDataPoints"
            );
            chart
                .getEventBus()
                .getStream(CHART_VIEW_STATUS_EVENT)
                .next({ data: { isChartInView: true } });

            expect(spy).toHaveBeenCalled();
        });
    });
});
