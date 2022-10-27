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

import { arc, Arc, DefaultArcObject, select } from "d3";
import { Subject } from "rxjs";

import {
    D3Selection,
    IAccessors,
    IDataSeries,
    IRenderContainers,
    IRendererEventPayload,
} from "../../../core/common/types";
import { GaugeMode } from "../../../gauge/constants";
import { GaugeUtil } from "../../../gauge/gauge-util";
import { IGaugeConfig, GaugeThresholdDefs } from "../../../gauge/types";
import { IRenderSeries, RenderLayerName } from "../../types";
import { RadialAccessors } from "../accessors/radial-accessors";
import { DonutGaugeRenderingUtil } from "./donut-gauge-rendering-util";
import { DonutGaugeThresholdsRenderer } from "./donut-gauge-thresholds-renderer";

describe("DonutGaugeThresholdsRenderer >", () => {
    let renderer: DonutGaugeThresholdsRenderer;
    let gaugeConfig: IGaugeConfig;
    let svg: D3Selection<SVGSVGElement> | any;
    let renderSeries: IRenderSeries<RadialAccessors>;
    let dataSeries: IDataSeries<IAccessors>;
    const containers: IRenderContainers = {};
    const standardThresholdsConfig = GaugeUtil.createStandardThresholdsConfig(
        3,
        7
    );

    beforeEach(() => {
        renderer = new DonutGaugeThresholdsRenderer();
        svg = select(document.createElement("div")).append("svg");
        containers[RenderLayerName.data] = svg.append("g");
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

        const gaugeAttributes = GaugeUtil.generateRenderingAttributes(
            gaugeConfig,
            GaugeMode.Donut
        );
        dataSeries = GaugeUtil.generateThresholdSeries(
            gaugeConfig,
            gaugeAttributes
        );

        renderSeries = {
            dataSeries: dataSeries as IDataSeries<RadialAccessors, any>,
            containers,
            scales: gaugeAttributes.scales,
        };
    });

    describe("draw", () => {
        let thresholdMarkers: D3Selection;
        let arcGenerator: Arc<any, DefaultArcObject>;
        let markerData: any[];

        beforeEach(() => {
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            thresholdMarkers =
                containers[RenderLayerName.data].selectAll("circle");

            const innerRadius = renderer.getInnerRadius(
                renderSeries.scales.r.range(),
                0
            );
            arcGenerator = arc()
                .outerRadius(
                    renderer.getOuterRadius(renderSeries.scales.r.range(), 0)
                )
                .innerRadius(innerRadius >= 0 ? innerRadius : 0);
            markerData = DonutGaugeRenderingUtil.generateThresholdArcData(
                renderSeries.dataSeries.data
            );
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
                containers[RenderLayerName.data].selectAll("circle");
            expect(thresholdMarkers.nodes().length).toEqual(0);
        });

        it("should use the configured marker radius", () => {
            renderer.config.markerRadius = 123;
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            thresholdMarkers =
                containers[RenderLayerName.data].selectAll("circle");
            thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                expect(node.getAttribute("r")).toEqual("123");
            });
        });

        it("should position the threshold markers correctly", () => {
            thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                expect(node.getAttribute("cx")).toEqual(
                    arcGenerator.centroid(markerData[i])[0].toString()
                );
                expect(node.getAttribute("cy")).toEqual(
                    arcGenerator.centroid(markerData[i])[1].toString()
                );
            });
        });

        it("should assign marker fill color based on the hit value", () => {
            thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
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
