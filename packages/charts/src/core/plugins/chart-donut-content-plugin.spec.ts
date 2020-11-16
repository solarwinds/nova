import { Chart } from "../chart";
import { RadialGrid } from "../grid/radial-grid";
import { IGrid } from "../grid/types";

import { ChartDonutContentPlugin } from "./chart-donut-content-plugin";

describe("ChartDonutContentPlugin >", () => {
    let grid: IGrid;
    let chart: Chart;
    let plugin: ChartDonutContentPlugin;

    beforeEach(() => {
        grid = new RadialGrid();
        chart = new Chart(grid);
        plugin = new ChartDonutContentPlugin();

        chart.addPlugin(plugin);
        chart.initialize();
    });

    describe("updateDimensions >", () => {
        const expectedContentPosition = { top: 1, left: 1, width: 1, height: 1 };

        beforeEach(() => {
            spyOn((<any>plugin), "getContentPosition").and.returnValue(expectedContentPosition);
            spyOn((<any>plugin).chart, "getDataManager").and.returnValue({ chartSeriesSet: [] });
        });

        it("should emit a content position update event", () => {
            spyOn(plugin.contentPositionUpdateSubject, "next");
            plugin.updateDimensions();
            expect(plugin.contentPositionUpdateSubject.next).toHaveBeenCalledWith(expectedContentPosition);
        });

        it("should set contentPosition", () => {
            expect(plugin.contentPosition).toEqual({ top: 0, left: 0, width: 0, height: 0 });
            plugin.updateDimensions();
            expect(plugin.contentPosition).toEqual(expectedContentPosition);
        });
    });
});
