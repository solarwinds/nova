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
import { Subject } from "rxjs";

import {
    D3Selection,
    IAccessors,
    IDataSeries,
    IRenderContainers,
    IRendererEventPayload,
} from "../../core/common/types";
import { GaugeMode } from "../../gauge/constants";
import { GaugeUtil, IGaugeRenderingAttributes } from "../../gauge/gauge-util";
import { IGaugeConfig, GaugeThresholdDefs } from "../../gauge/types";
import { IRenderSeries, RenderLayerName } from "../types";
import { BarAccessors } from "./accessors/bar-accessors";
import { LinearGaugeThresholdsRenderer } from "./linear-gauge-thresholds-renderer";

describe("LinearGaugeThresholdsRenderer >", () => {
    let renderer: LinearGaugeThresholdsRenderer;
    let gaugeConfig: IGaugeConfig;
    let svg: D3Selection<SVGSVGElement> | any;
    let renderSeries: IRenderSeries<BarAccessors>;
    let dataSeries: IDataSeries<IAccessors>;
    const containers: IRenderContainers = {};
    const standardThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(
        3,
        7
    );

    beforeEach(() => {
        renderer = new LinearGaugeThresholdsRenderer();
        svg = select(document.createElement("div")).append("svg");
        containers[RenderLayerName.unclippedData] = svg.append("g");
        gaugeConfig = {
            value: 5,
            max: 10,
            thresholds: {
                ...standardThresholdsConfig,
                definitions: {
                    ...standardThresholdsConfig.definitions,
                    additionalThreshold: {
                        id: "additionalThreshold",
                        value: 9,
                        enabled: true,
                        color: "green",
                    },
                },
            },
        };
    });

    describe("draw", () => {
        let gaugeAttributes: IGaugeRenderingAttributes;
        let thresholdMarkers: D3Selection;

        beforeEach(() => {
            gaugeAttributes = GaugeUtil.generateRenderingAttributes(
                gaugeConfig,
                GaugeMode.Vertical
            );
            gaugeAttributes.scales.x.domain(["gauge"]);
            dataSeries = GaugeUtil.generateThresholdSeries(
                gaugeConfig,
                gaugeAttributes
            );

            renderSeries = {
                dataSeries: dataSeries as IDataSeries<BarAccessors, any>,
                containers,
                scales: gaugeAttributes.scales,
            };

            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            thresholdMarkers =
                containers[RenderLayerName.unclippedData].selectAll("circle");
        });

        it("should render the correct number of threshold markers", () => {
            expect(thresholdMarkers.nodes().length).toEqual(
                Object.keys(
                    gaugeConfig.thresholds?.definitions as GaugeThresholdDefs
                ).length
            );
        });

        it("should not render any threshold markers if disabled", () => {
            renderer.config.enabled = false;
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            thresholdMarkers =
                containers[RenderLayerName.unclippedData].selectAll("circle");
            expect(thresholdMarkers.nodes().length).toEqual(0);
        });

        it("should use the configured marker radius", () => {
            renderer.config.markerRadius = 123;
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            thresholdMarkers =
                containers[RenderLayerName.unclippedData].selectAll("circle");
            thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                expect(node.getAttribute("r")).toEqual("123");
            });
        });

        describe("vertical gauge", () => {
            it("should position the threshold markers correctly", () => {
                thresholdMarkers
                    .nodes()
                    .forEach((node: SVGElement, i: number) => {
                        const endX =
                            gaugeAttributes.quantityAccessors?.data?.endX?.(
                                dataSeries.data[i],
                                i,
                                dataSeries.data,
                                dataSeries
                            );
                        const endY =
                            gaugeAttributes.quantityAccessors?.data?.endY?.(
                                dataSeries.data[i],
                                i,
                                dataSeries.data,
                                dataSeries
                            );
                        expect(node.getAttribute("cx")).toEqual(
                            renderSeries.scales.x.convert(endX).toString()
                        );
                        expect(node.getAttribute("cy")).toEqual(
                            renderSeries.scales.y.convert(endY).toString()
                        );
                    });
            });

            it("should assign marker fill color based on the hit value", () => {
                thresholdMarkers
                    .nodes()
                    .forEach((node: SVGElement, i: number) => {
                        // only the first threshold is hit for these tests
                        expect(node.getAttribute("style")).toEqual(
                            `fill: var(--nui-color-${
                                i === 0 ? "text-light" : "icon-default"
                            }); stroke-width: 0;`
                        );
                    });
            });
        });

        describe("horizontal gauge", () => {
            let gaugeAttributes: IGaugeRenderingAttributes;

            beforeEach(() => {
                gaugeAttributes = GaugeUtil.generateRenderingAttributes(
                    gaugeConfig,
                    GaugeMode.Horizontal
                );
                gaugeAttributes.scales.y.domain(["gauge"]);

                dataSeries = GaugeUtil.generateThresholdSeries(
                    gaugeConfig,
                    gaugeAttributes
                );

                renderSeries = {
                    dataSeries: dataSeries as IDataSeries<BarAccessors, any>,
                    containers,
                    scales: gaugeAttributes.scales,
                };

                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                thresholdMarkers =
                    containers[RenderLayerName.unclippedData].selectAll(
                        "circle"
                    );
            });

            it("should render the correct number of threshold markers", () => {
                expect(thresholdMarkers.nodes().length).toEqual(
                    Object.keys(
                        gaugeConfig.thresholds
                            ?.definitions as GaugeThresholdDefs
                    ).length
                );
            });

            it("should position the threshold markers correctly", () => {
                thresholdMarkers
                    .nodes()
                    .forEach((node: SVGElement, i: number) => {
                        const endX =
                            gaugeAttributes.quantityAccessors?.data?.endX?.(
                                dataSeries.data[i],
                                i,
                                dataSeries.data,
                                dataSeries
                            );
                        const endY =
                            gaugeAttributes.quantityAccessors?.data?.endY?.(
                                dataSeries.data[i],
                                i,
                                dataSeries.data,
                                dataSeries
                            );
                        expect(node.getAttribute("cx")).toEqual(
                            renderSeries.scales.x.convert(endX).toString()
                        );
                        expect(node.getAttribute("cy")).toEqual(
                            renderSeries.scales.y.convert(endY).toString()
                        );
                    });
            });

            it("should assign marker fill color based on the hit value", () => {
                thresholdMarkers
                    .nodes()
                    .forEach((node: SVGElement, i: number) => {
                        // only the first threshold is hit for these tests
                        expect(node.getAttribute("style")).toEqual(
                            `fill: var(--nui-color-${
                                i === 0 ? "text-light" : "icon-default"
                            }); stroke-width: 0;`
                        );
                    });
            });
        });
    });
});
