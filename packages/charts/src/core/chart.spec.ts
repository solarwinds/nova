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
        expect(grid.updateChartDimensionsSubject).toBe(
            (<any>chart).updateDimensionsSubject
        );
    });

    describe("build", () => {
        it("should invoke buildGrid", () => {
            const spy = spyOn(<any>chart, "buildGrid").and.callThrough();
            chart.build(element);
            expect(spy).toHaveBeenCalled();
        });

        it("should put the render engine plugin at the front of the plugins array", () => {
            expect((<any>chart).plugins.length).toEqual(0);
            chart.addPlugin(new InteractionLabelPlugin());
            chart.build(element);
            expect((<any>chart).plugins.length).toBeGreaterThan(1);
            expect(
                (<any>chart).plugins[0] instanceof RenderEnginePlugin
            ).toEqual(true);
        });
    });
});
