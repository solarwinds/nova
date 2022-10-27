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

import { ValueMap } from "d3-selection-multi";
import { Subject } from "rxjs";

import { STANDARD_RENDER_LAYERS } from "../../constants";
import {
    IRenderSeries,
    RenderLayerName,
    RenderState,
} from "../../renderers/types";
import { Renderer } from "./renderer";
import { NoopScale } from "./scales/noop-scale";
import { EMPTY_CONTINUOUS_DOMAIN, Scales } from "./scales/types";
import {
    DataAccessor,
    IAccessors,
    IDataSeries,
    IPosition,
    IRendererEventPayload,
} from "./types";

class MockRenderer extends Renderer<IAccessors> {
    public draw(
        renderSeries: IRenderSeries<IAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}

    public getDataPointPosition(
        dataSeries: IDataSeries<IAccessors>,
        index: number,
        scales: Scales
    ): IPosition {
        // @ts-ignore: Disabled for testing purposes
        return null;
    }
}

describe("Renderer >", () => {
    let renderer: MockRenderer;

    beforeEach(() => {
        renderer = new MockRenderer();
    });

    it("should have empty interection property", () => {
        expect(renderer.interaction).toEqual({});
    });

    describe("getDataPointIndex()", () => {
        it("should return -1 if not overriden", () => {
            // @ts-ignore: Disabled for testing purposes
            expect(renderer.getDataPointIndex(null, null, null)).toEqual(-1);
        });
    });

    describe("getContainerStateStyles()", () => {
        let expectedStyle: ValueMap<any, any> = {};
        let state: RenderState;

        beforeEach(() => {
            expectedStyle = {
                opacity: 1,
            };
        });

        it("should decrease opacity for 'deemphasized' state", () => {
            state = RenderState.deemphasized;
            expectedStyle.opacity = 0.1;

            expect(renderer.getContainerStateStyles(state)).toEqual(
                expectedStyle
            );
        });

        it("should hide for 'hidden' state", () => {
            state = RenderState.hidden;
            expectedStyle.opacity = 0;

            expect(renderer.getContainerStateStyles(state)).toEqual(
                expectedStyle
            );
        });

        it("should return default styles for 'emphasized' and 'default' state", () => {
            state = RenderState.emphasized;
            expect(renderer.getContainerStateStyles(state)).toEqual(
                expectedStyle
            );

            state = RenderState.default;
            expect(renderer.getContainerStateStyles(state)).toEqual(
                expectedStyle
            );
        });

        it("should return default styles for no state specified", () => {
            // @ts-ignore: Disabled for testing purposes
            expect(renderer.getContainerStateStyles(null)).toEqual(
                expectedStyle
            );
        });
    });

    describe("getDomain()", () => {
        it("should calculate min and max values, using data accessor with the scale name", () => {
            const accessor: DataAccessor = (d) => d.a;
            const data = [
                { a: 0, b: 10, c: 100 },
                { a: -5, b: 30, c: 500 },
                { a: 8, b: -20, c: -400 },
            ];
            const domain = renderer.getDomain(
                data,
                { id: "x", data, accessors: { data: { a: accessor } } },
                "a",
                new NoopScale()
            );
            expect(domain).toEqual([-5, 8]);
        });

        it("should return the empty continuous domain for null data", () => {
            const accessor: DataAccessor = (d) => d.a;
            const domain = renderer.getDomain(
                // @ts-ignore: Disabled for testing purposes
                null,
                { id: "x", data: null, accessors: { data: { a: accessor } } },
                "a",
                new NoopScale()
            );
            expect(domain).toEqual(EMPTY_CONTINUOUS_DOMAIN);
        });

        it("should return the empty continuous domain for empty data", () => {
            const accessor: DataAccessor = (d) => d.a;
            const domain = renderer.getDomain(
                [],
                { id: "x", data: [], accessors: { data: { a: accessor } } },
                "a",
                new NoopScale()
            );
            expect(domain).toEqual(EMPTY_CONTINUOUS_DOMAIN);
        });
    });

    describe("getRequiredLayers()", () => {
        it("should require 'data' layer only", () => {
            const layers = renderer.getRequiredLayers();
            expect(layers.length).toBe(1);
            expect(layers).toContain(
                STANDARD_RENDER_LAYERS[RenderLayerName.data]
            );
        });
    });
});
