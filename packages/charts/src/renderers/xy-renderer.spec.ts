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

import { Subject } from "rxjs";

import { XYAccessors } from "./accessors/xy-accessors";
import { IRenderSeries } from "./types";
import { XYRenderer } from "./xy-renderer";
import { LinearScale } from "../core/common/scales/linear-scale";
import { Scales } from "../core/common/scales/types";
import {
    IAccessors,
    IDataSeries,
    IPosition,
    IRendererEventPayload,
} from "../core/common/types";

export class MockXYRenderer extends XYRenderer<XYAccessors> {
    public draw(
        renderSeries: IRenderSeries<IAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}
}

class TestXYAccessors extends XYAccessors {}

describe("XY Renderer >", () => {
    let renderer: MockXYRenderer;

    beforeEach(() => {
        renderer = new MockXYRenderer();
    });

    describe("getDataPointPosition()", () => {
        let position: IPosition | undefined;
        let dataSeries: IDataSeries<XYAccessors>;
        let scales: Scales;

        beforeEach(() => {
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
                accessors: new TestXYAccessors(),
            };
            scales = {
                x: new LinearScale(),
                y: new LinearScale(),
            };
        });

        it("should return the proper position by index", () => {
            position = renderer.getDataPointPosition(dataSeries, 0, scales);
            expect(position).toEqual({ x: 0, y: 0 });
            position = renderer.getDataPointPosition(dataSeries, 1, scales);
            expect(position).toEqual({ x: 1, y: 1 });
        });

        it("should handle index out of range properly", () => {
            position = renderer.getDataPointPosition(dataSeries, -1, scales);
            expect(position).toBeUndefined();
            position = renderer.getDataPointPosition(dataSeries, 2, scales);
            expect(position).toBeUndefined();
        });

        it("should respect scale", () => {
            scales.x.range([10, 100]);
            scales.y.range([20, 200]);

            position = renderer.getDataPointPosition(dataSeries, 0, scales);
            expect(position).toEqual({ x: 10, y: 20 });
            position = renderer.getDataPointPosition(dataSeries, 1, scales);
            expect(position).toEqual({ x: 100, y: 200 });
        });
    });
});
