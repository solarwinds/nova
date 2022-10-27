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

import { STANDARD_RENDER_LAYERS } from "../../constants";
import { CHART_PALETTE_CS1 } from "../../core/common/palette/palettes";
import { SequentialColorProvider } from "../../core/common/palette/sequential-color-provider";
import { LinearScale } from "../../core/common/scales/linear-scale";
import { EMPTY_CONTINUOUS_DOMAIN } from "../../core/common/scales/types";
import {
    D3Selection,
    IDataSeries,
    IRenderContainers,
    IRendererEventPayload,
} from "../../core/common/types";
import { IRenderSeries, RenderLayerName } from "../types";
import { AreaAccessors, IAreaAccessors } from "./area-accessors";
import { AreaRenderer } from "./area-renderer";

describe("Area Renderer >", () => {
    let renderer: AreaRenderer;
    let accessors: IAreaAccessors;
    let dataSeries: IDataSeries<IAreaAccessors>;

    beforeEach(() => {
        renderer = new AreaRenderer();
        accessors = new AreaAccessors();
        dataSeries = {
            id: "1",
            name: "Series 1",
            data: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            ],
            accessors: accessors,
        };
    });

    it("should have correct render layers", () => {
        const layers = renderer.getRequiredLayers();
        expect(layers.length).toBe(2);
        expect(layers).toContain(STANDARD_RENDER_LAYERS[RenderLayerName.data]);
        expect(layers).toContain(
            STANDARD_RENDER_LAYERS[RenderLayerName.foreground]
        );
    });

    describe("draw()", () => {
        // Using any as a fallback type to avoid strict mode error
        let svg: D3Selection<SVGSVGElement> | any;
        let renderSeries: IRenderSeries<IAreaAccessors>;
        let path: D3Selection;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.data] = svg.append("g");
            renderSeries = {
                dataSeries,
                containers,
                scales: { x: new LinearScale(), y: new LinearScale() },
            };
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            path = containers[RenderLayerName.data].select("path");
        });

        it("should create the path", () => {
            const provider = new SequentialColorProvider(CHART_PALETTE_CS1);
            expect(path.node()).toBeTruthy();
            expect(path.attr("d")).toBe("M0,0L1,1L1,1L0,0Z");
            expect(path.attr("fill")).toBe(provider.get(dataSeries.id));
        });

        it("should update the path with new data", () => {
            const newSeries = cloneDeep(renderSeries);
            newSeries.dataSeries.data = [
                { x: 1, y: 1 },
                { x: 0, y: 0 },
            ];
            renderer.draw(newSeries, new Subject<IRendererEventPayload>());

            expect(path.attr("d")).toBe("M1,1L0,0L0,0L1,1Z");
        });

        it("should produce an empty path if the data is empty", () => {
            const newSeries = cloneDeep(renderSeries);
            newSeries.dataSeries.data = [];
            renderer.draw(newSeries, new Subject<IRendererEventPayload>());

            expect(path.attr("d")).toBe("");
        });
    });

    describe("getDomain", () => {
        it("should return EMPTY_CONTINUOUS_DOMAIN if the data is null", () => {
            expect(
                renderer.getDomain([], dataSeries, "x", new LinearScale())
            ).toEqual(EMPTY_CONTINUOUS_DOMAIN);
        });
    });

    describe("filterDataByDomain", () => {
        beforeEach(() => {
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [{ x: 3, start: 2, end: 4 }],
                accessors,
            };

            accessors.data.y0 = (d) => d.start;
            accessors.data.y1 = (d) => d.end;
        });

        it("should not filter out data whose y0 and y1 are fully within the domain", () => {
            const filteredData = renderer.filterDataByDomain(
                dataSeries.data,
                dataSeries,
                "y",
                [1, 5]
            );
            expect(filteredData).toContain(dataSeries.data[0]);
        });

        it("should not filter out data whose y0 is within the domain", () => {
            const filteredData = renderer.filterDataByDomain(
                dataSeries.data,
                dataSeries,
                "y",
                [1, 3]
            );
            expect(filteredData).toContain(dataSeries.data[0]);
        });

        it("should not filter out data whose y1 is within the domain", () => {
            const filteredData = renderer.filterDataByDomain(
                dataSeries.data,
                dataSeries,
                "y",
                [3, 5]
            );
            expect(filteredData).toContain(dataSeries.data[0]);
        });

        it("should filter out data whose y0 and y1 are both less than the domain", () => {
            const filteredData = renderer.filterDataByDomain(
                dataSeries.data,
                dataSeries,
                "y",
                [5, 7]
            );
            expect(filteredData).not.toContain(dataSeries.data[0]);
        });

        it("should filter out data whose y0 and y1 are both greater than the domain", () => {
            const filteredData = renderer.filterDataByDomain(
                dataSeries.data,
                dataSeries,
                "y",
                [-1, 1]
            );
            expect(filteredData).not.toContain(dataSeries.data[0]);
        });
    });

    describe("getDomain", () => {
        beforeEach(() => {
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: new Date(2020, 1, 1), start: 1, end: 2 },
                    { x: new Date(2020, 1, 2), start: 2, end: 3 },
                    { x: new Date(2020, 1, 3), start: 3, end: 4 },
                ],
                accessors,
            };

            accessors.data.y0 = (d) => d.start;
            accessors.data.y1 = (d) => d.end;
        });

        it("works with Date types", () => {
            const xDomain = renderer.getDomain(
                dataSeries.data,
                dataSeries,
                "x",
                undefined as any
            );

            expect(xDomain[0]).toEqual(new Date(2020, 1, 1));
            expect(xDomain[1]).toEqual(new Date(2020, 1, 3));
        });

        it("works with number types", () => {
            const yDomain = renderer.getDomain(
                dataSeries.data,
                dataSeries,
                "y",
                undefined as any
            );

            expect(yDomain[0]).toEqual(1);
            expect(yDomain[1]).toEqual(4);
        });
    });
});
