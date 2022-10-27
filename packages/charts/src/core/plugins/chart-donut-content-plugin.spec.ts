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
        const expectedContentPosition = {
            top: 1,
            left: 1,
            width: 1,
            height: 1,
        };

        beforeEach(() => {
            spyOn(<any>plugin, "getContentPosition").and.returnValue(
                expectedContentPosition
            );
            spyOn((<any>plugin).chart, "getDataManager").and.returnValue({
                chartSeriesSet: [],
            });
        });

        it("should emit a content position update event", () => {
            spyOn(plugin.contentPositionUpdateSubject, "next");
            plugin.updateDimensions();
            expect(
                plugin.contentPositionUpdateSubject.next
            ).toHaveBeenCalledWith(expectedContentPosition);
        });

        it("should set contentPosition", () => {
            expect(plugin.contentPosition).toEqual({
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            });
            plugin.updateDimensions();
            expect(plugin.contentPosition).toEqual(expectedContentPosition);
        });
    });
});
