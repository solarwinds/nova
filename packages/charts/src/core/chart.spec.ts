import { Chart } from "./chart";
import { IGrid } from "./grid/types";
import { XYGrid } from "./grid/xy-grid";
import { InteractionLabelPlugin } from "./plugins/interaction/interaction-label-plugin";
import { RenderEnginePlugin } from "./plugins/render-engine-plugin";

describe("Chart", () => {
    let chart: Chart;
    let grid: IGrid;
    let element: HTMLElement;

    beforeEach(() => {
        grid = new XYGrid();
        chart = new Chart(grid);
        element = document.createElement("div");
    });

    it("should populate the grid's updateChartDimensionsSubject", () => {
        expect(grid.updateChartDimensionsSubject).toBe((<any>chart).updateDimensionsSubject);
    });

    describe("build", () => {
        it("should invoke buildGrid", () => {
            const spy = spyOn((<any>chart), "buildGrid").and.callThrough();
            chart.build(element);
            expect(spy).toHaveBeenCalled();
        });

        it("should put the render engine plugin at the front of the plugins array", () => {
            expect((<any>chart).plugins.length).toEqual(0);
            chart.addPlugin(new InteractionLabelPlugin());
            chart.build(element);
            expect((<any>chart).plugins.length).toBeGreaterThan(1);
            expect((<any>chart).plugins[0] instanceof RenderEnginePlugin).toEqual(true);
        });
    });
});
