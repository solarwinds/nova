import {
    CHART_VIEW_STATUS_EVENT,
    INTERACTION_VALUES_EVENT,
} from "../../../constants";
import { Chart } from "../../chart";
import { InteractionType } from "../../common/types";
import { IGrid } from "../../grid/types";
import { XYGrid } from "../../grid/xy-grid";
import { IInteractionValuesPayload } from "../types";

import { InteractionLinePlugin } from "./interaction-line-plugin";

describe("InteractionLinePlugin >", () => {
    let grid: IGrid;
    let chart: Chart;
    let plugin: InteractionLinePlugin;

    beforeEach(() => {
        grid = new XYGrid();

        chart = new Chart(grid);

        plugin = new InteractionLinePlugin();
        (<any>plugin).isChartInView = true;

        chart.addPlugin(plugin);

        const element = document.createElement("div");
        chart.build(element);
    });

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
            (<any>plugin).isChartInView = true;

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

        it("should trigger a line update when the chart enters view", () => {
            (<any>plugin).lastInteractionValuesPayload = {
                interactionType: InteractionType.MouseMove,
                values: {},
            };

            const spy = spyOn(<any>plugin, "handleLineUpdate");
            (<any>plugin).isChartInView = false;

            chart
                .getEventBus()
                .getStream(CHART_VIEW_STATUS_EVENT)
                .next({ data: { isChartInView: true } });

            expect(spy).toHaveBeenCalled();
        });
    });
});
