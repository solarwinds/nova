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

import { select } from "d3";
import cloneDeep from "lodash/cloneDeep";
import { Subject } from "rxjs";

import { LinearScale } from "../../../core/common/scales/linear-scale";
import {
    D3Selection,
    IDataSeries,
    IRenderContainers,
    IRendererEventPayload,
} from "../../../core/common/types";
import { IRenderSeries, RenderLayerName } from "../../types";
import { ILineAccessors, LineAccessors } from "../line-accessors";
import { LineRenderer } from "../line-renderer";
import { LineSelectSeriesInteractionStrategy } from "./line-select-series-interaction-strategy";

describe("LineSelectSeriesInteractionStrategy", () => {
    let renderer: LineRenderer;
    let accessors: ILineAccessors;

    beforeEach(() => {
        renderer = new LineRenderer();
        accessors = new LineAccessors();
    });

    describe("draw()", () => {
        const strategy = new LineSelectSeriesInteractionStrategy();
        // Using any as a fallback type to avoid strict mode error
        let svg: D3Selection<SVGSVGElement> | any;
        let dataSeries: IDataSeries<ILineAccessors>;
        let renderSeries: IRenderSeries<ILineAccessors>;
        let path: D3Selection;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.data] = svg.append("g");
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
                accessors: accessors,
            };
            renderSeries = {
                dataSeries,
                containers,
                scales: { x: new LinearScale(), y: new LinearScale() },
            };
            strategy.draw(
                renderer,
                renderSeries,
                new Subject<IRendererEventPayload>()
            );
            path = containers[RenderLayerName.data].select("path.interaction");
        });

        it("should create the path", () => {
            expect(path.node()).toBeTruthy();
            expect(path.attr("d")).toBe("M0,0L1,1");
            expect(path.attr("stroke")).toBe("transparent");
            expect(path.attr("stroke-width")).toBe(
                (2 + 2 * strategy.INTERACTION_MARGIN).toString()
            );
            expect(path.attr("fill")).toBe("none");
        });

        it("should add the correct css classes", () => {
            expect(path.classed("pointer-events")).toBeTruthy();
            expect(path.classed("pointer-events-click")).toBeTruthy();
        });

        it("should define handlers for mouse events", () => {
            expect(path.on("mouseenter")).toBeDefined();
            expect(path.on("mouseleave")).toBeDefined();
            expect(path.on("click")).toBeDefined();
        });

        it("should update the path with new data", () => {
            const newSeries = cloneDeep(renderSeries);
            newSeries.dataSeries.data = [
                { x: 1, y: 1 },
                { x: 0, y: 0 },
            ];
            strategy.draw(
                renderer,
                newSeries,
                new Subject<IRendererEventPayload>()
            );

            expect(path.attr("d")).toBe("M1,1L0,0");
        });
    });
});
