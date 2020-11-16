import { select } from "d3-selection";

import { INTERACTION_DATA_POINTS_EVENT } from "../../constants";
import { Chart } from "../chart";
import { IChartEvent, InteractionType } from "../common/types";
import { XYGridConfig } from "../grid/config/xy-grid-config";
import { IGrid, IGridConfig } from "../grid/types";
import { XYGrid } from "../grid/xy-grid";

import { RadialPopoverPlugin } from "./radial-popover-plugin";

describe("RadialPopoverPlugin >", () => {
    let grid: IGrid;
    let gridConfig: IGridConfig;
    let chart: Chart;
    let plugin: RadialPopoverPlugin;
    let interactionDataPointsEventPayload: IChartEvent;

    beforeEach(() => {
        grid = new XYGrid();
        gridConfig = new XYGridConfig();
        chart = new Chart(grid);

        // @ts-ignore: Disabled for testing purposes
        chart.target = select(document.createElement("div")).append("svg");
        plugin = new RadialPopoverPlugin();
        interactionDataPointsEventPayload = {
            data: {
                interactionType: InteractionType.MouseMove,
                dataPoints: {
                    "series-1": {
                        "index": 5,
                        "position": { "x": 400, "y": 30 },
                    },
                    "series-2": {
                        "index": 5,
                        "position": { "x": 560, "y": 50 },
                    },
                },
            },
        };
        gridConfig.dimension.margin.left = 30;
        grid.config(gridConfig);

        chart.addPlugin(plugin);
        chart.initialize();
        plugin.initialize();
    });

    it("should result in calculating the popover target position", () => {
        const parentNodeValues = {
            offsetTop: 10,
            offsetLeft: 10,
        };

        // @ts-ignore: Disabled for testing purposes
        spyOnProperty(chart.target?.node(), "parentNode").and.returnValue(parentNodeValues);
        chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next(interactionDataPointsEventPayload);

        expect(plugin.popoverTargetPosition).toEqual({
            top: 40,
            left: 440,
            width: 0,
            height: 0,
        });
    });
});
