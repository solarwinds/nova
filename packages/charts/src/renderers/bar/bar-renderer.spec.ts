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

import { select } from "d3-selection";
import cloneDeep from "lodash/cloneDeep";
import { Subject } from "rxjs";

import { EMPTY_CONTINUOUS_DOMAIN } from "src/core/common/scales/types";

import { STANDARD_RENDER_LAYERS } from "../../constants";
import { BandScale } from "../../core/common/scales/band-scale";
import { LinearScale } from "../../core/common/scales/linear-scale";
import {
    D3Selection,
    IDataSeries,
    IRenderContainers,
    IRendererEventPayload,
} from "../../core/common/types";
import { flushAllD3Transitions } from "../../spec-helpers/flush-transitions";
import { IRenderSeries, RenderLayerName } from "../types";
import { IBarAccessors } from "./accessors/bar-accessors";
import { HorizontalBarAccessors } from "./accessors/horizontal-bar-accessors";
import { VerticalBarAccessors } from "./accessors/vertical-bar-accessors";
import { BarRenderer } from "./bar-renderer";

describe("Bar Renderer >", () => {
    let renderer: BarRenderer;
    let accessors: IBarAccessors;

    beforeEach(() => {
        renderer = new BarRenderer();
        accessors = new VerticalBarAccessors();
    });

    it("should have correct render layers", () => {
        const layers = renderer.getRequiredLayers();
        expect(layers.length).toBe(1);
        expect(layers).toContain(STANDARD_RENDER_LAYERS[RenderLayerName.data]);
    });

    describe("draw()", () => {
        // Using any as a fallback type to avoid strict mode error
        let svg: D3Selection<SVGSVGElement> | any;
        let renderSeries: IRenderSeries<IBarAccessors>;
        let bandScale: BandScale;
        let linearScale: LinearScale;
        let dataSeries: IDataSeries<IBarAccessors>;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.data] = svg.append("g");
            bandScale = new BandScale();
            linearScale = new LinearScale();
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    {
                        category: "Edge",
                        value: 1,
                        __bar: {
                            category: "Edge",
                            start: 0,
                            end: 5,
                        },
                    },
                ],
                accessors,
            };
        });

        it("should apply a cursor style if configured", () => {
            bandScale.domain(["Edge"]);
            bandScale.range([0, 100]);
            renderSeries = {
                dataSeries: {
                    ...dataSeries,
                },
                containers,
                scales: { x: bandScale, y: linearScale },
            };
            renderer.config.cursor = "pointer";
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            flushAllD3Transitions();
            expect(svg.node().innerHTML).toEqual(
                `<g><g class="bar-container">` +
                    `<rect class="bar bar-outline pointer-events" x="1" width="98" y="0" height="5" style="cursor: pointer; fill: var(--nui-color-chart-one);"></rect>` +
                    `</g></g>`
            );
        });

        it("should apply the css class returned by the cssClass accessor", () => {
            bandScale.domain(["Edge"]);
            bandScale.range([0, 100]);
            renderSeries = {
                dataSeries: {
                    ...dataSeries,
                },
                containers,
                scales: { x: bandScale, y: linearScale },
            };
            accessors.data.cssClass = () => "test-class";
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            flushAllD3Transitions();
            expect(svg.node().innerHTML).toEqual(
                `<g><g class="bar-container">` +
                    `<rect class="bar bar-outline pointer-events test-class" x="1" width="98" y="0" height="5" style="fill: var(--nui-color-chart-one);"></rect>` +
                    `</g></g>`
            );
        });

        it("should not have the css class pointer-events when config is false", () => {
            renderer = new BarRenderer({ pointerEvents: false });
            bandScale.domain(["Edge"]);
            bandScale.range([0, 100]);
            renderSeries = {
                dataSeries: {
                    ...dataSeries,
                },
                containers,
                scales: { x: bandScale, y: linearScale },
            };
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            flushAllD3Transitions();
            expect(svg.node().innerHTML).toEqual(
                `<g><g class="bar-container">` +
                    `<rect class="bar bar-outline" x="1" width="98" y="0" height="5" style="fill: var(--nui-color-chart-one);"></rect>` +
                    `</g></g>`
            );
        });

        describe("in vertical orientation", () => {
            beforeEach(() => {
                bandScale.domain(["Edge"]);
                bandScale.range([0, 100]);
                renderSeries = {
                    dataSeries: {
                        ...dataSeries,
                    },
                    containers,
                    scales: { x: bandScale, y: linearScale },
                };
            });

            it("should create the path", () => {
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                flushAllD3Transitions();
                expect(svg.node()?.innerHTML).toEqual(
                    `<g><g class="bar-container">` +
                        `<rect class="bar bar-outline pointer-events" x="1" width="98" y="0" height="5" style="fill: var(--nui-color-chart-one);"></rect>` +
                        `</g></g>`
                );
            });

            it("should update the path with new data", () => {
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                flushAllD3Transitions();
                const newSeries = cloneDeep(renderSeries);
                newSeries.dataSeries.data = [
                    {
                        value: 50,
                        category: "Edge",
                        __bar: {
                            category: "Edge",
                            start: 0,
                            end: 50,
                        },
                    },
                ];
                newSeries.scales["y"].range([100, 0]);
                newSeries.scales["y"].domain([0, 100]);
                renderer.draw(newSeries, new Subject<IRendererEventPayload>());
                flushAllD3Transitions();
                expect(svg.node()?.innerHTML).toBe(
                    `<g><g class="bar-container">` +
                        `<rect class="bar bar-outline pointer-events" x="1" width="98" y="50" height="50" style="fill: var(--nui-color-chart-one);"></rect>` +
                        `</g></g>`
                );
            });
        });
        describe("in horizontal orientation", () => {
            beforeEach(() => {
                dataSeries.accessors = new HorizontalBarAccessors();
                bandScale.domain(["Edge"]);
                bandScale.range([0, 100]);
                renderSeries = {
                    dataSeries,
                    containers,
                    scales: { y: bandScale, x: linearScale },
                };
            });

            it("should create the path", () => {
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                flushAllD3Transitions();
                expect(svg.node()?.innerHTML).toBe(
                    `<g><g class="bar-container">` +
                        `<rect class="bar bar-outline pointer-events" x="0" width="5" y="1" height="98" style="fill: var(--nui-color-chart-one);"></rect>` +
                        `</g></g>`
                );
            });

            it("should update the path with new data", () => {
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                flushAllD3Transitions();
                const newSeries = cloneDeep(renderSeries);
                newSeries.dataSeries.data = [
                    {
                        value: 50,
                        category: "Edge",
                        __bar: {
                            category: "Edge",
                            start: 0,
                            end: 50,
                        },
                    },
                ];
                newSeries.scales["x"].range([100, 0]);
                newSeries.scales["x"].domain([0, 100]);
                renderer.draw(newSeries, new Subject<IRendererEventPayload>());
                flushAllD3Transitions();
                expect(svg.node()?.innerHTML).toBe(
                    `<g><g class="bar-container">` +
                        `<rect class="bar bar-outline pointer-events" x="50" width="50" y="1" height="98" style="fill: var(--nui-color-chart-one);"></rect>` +
                        `</g></g>`
                );
            });
        });
    });
    describe("getDataPointPosition()", () => {
        let svg: D3Selection<SVGSVGElement>;
        let bandScale: BandScale;
        let linearScale: LinearScale;
        let dataSeries: IDataSeries<IBarAccessors>;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            // @ts-ignore: Disabled for testing purposes
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.data] = svg.append("g");
            linearScale = new LinearScale();
            linearScale.range([100, 0]);
            linearScale.domain([0, 100]);

            bandScale = new BandScale();
            bandScale.domain(["Edge"]);
            bandScale.range([0, 100]);

            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    {
                        category: "Edge",
                        value: 42,
                        __bar: {
                            category: "Edge",
                            start: 0,
                            end: 42,
                        },
                    },
                ],
                accessors: accessors,
            };
        });

        // TODO: Re-enable after NUI-4162 is done.
        xit("in vertical orientation", () => {
            expect(
                renderer.getDataPointPosition(dataSeries, 0, {
                    x: bandScale,
                    y: linearScale,
                })
            ).toEqual({ x: 1, y: 58, width: 98, height: 42 });
        });
        // TODO: Re-enable after NUI-4162 is done.
        xit("in horizontal orientation", () => {
            dataSeries.accessors = new HorizontalBarAccessors();

            expect(
                renderer.getDataPointPosition(dataSeries, 0, {
                    x: linearScale,
                    y: bandScale,
                })
            ).toEqual({ x: 58, y: 1, width: 42, height: 98 });
        });
    });

    describe("getDomain >", () => {
        let dataSeries: IDataSeries<IBarAccessors>;

        beforeEach(() => {
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    {
                        category: "Edge",
                        value: 42,
                        __bar: {
                            category: "Edge",
                            start: 0,
                            end: 42,
                        },
                    },
                ],
                accessors,
            };
        });

        it("should return the empty continuous domain if the scale is continuous and the data is null", () => {
            // @ts-ignore: Disabled for testing purposes
            dataSeries.data = null;
            const domain = renderer.getDomain(
                dataSeries.data,
                dataSeries,
                "x",
                new LinearScale()
            );
            expect(domain).toEqual(EMPTY_CONTINUOUS_DOMAIN);
        });

        it("should return the empty continuous domain if the scale is continuous and the data is empty", () => {
            dataSeries.data = [];
            const domain = renderer.getDomain(
                dataSeries.data,
                dataSeries,
                "x",
                new LinearScale()
            );
            expect(domain).toEqual(EMPTY_CONTINUOUS_DOMAIN);
        });

        it("should return an empty domain if the scale is not continuous and the data is null", () => {
            // @ts-ignore: Disabled for testing purposes
            dataSeries.data = null;
            const domain = renderer.getDomain(
                dataSeries.data,
                dataSeries,
                "x",
                new BandScale()
            );
            expect(domain).toEqual([[]]);
        });

        it("should return an empty domain if the scale is not continuous and the data is empty", () => {
            dataSeries.data = [];
            const domain = renderer.getDomain(
                dataSeries.data,
                dataSeries,
                "x",
                new BandScale()
            );
            expect(domain).toEqual([[]]);
        });
    });
});
