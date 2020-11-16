import { Chart } from "./chart";
import { IGrid } from "./grid/types";
import { XYGrid } from "./grid/xy-grid";

describe("Chart", () => {
    let chart: Chart;
    let grid: IGrid;
    let element: HTMLElement;

    beforeEach(() => {
        grid = new XYGrid();
        chart = new Chart(grid);
        element = document.createElement("div");
        chart.build(element);
    });

    it("should populate the grid's updateChartDimensionsSubject", () => {
        expect(grid.updateChartDimensionsSubject).toBe((<any>chart).updateDimensionsSubject);
    });

    describe("build", () => {
        it("should invoke buildGrid", () => {
            const spy = spyOn((<any>chart), "buildGrid");
            chart.build(element);
            expect(spy).toHaveBeenCalled();
        });
    });
});
