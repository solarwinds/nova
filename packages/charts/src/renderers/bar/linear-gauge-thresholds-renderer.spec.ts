import { select } from "d3";
import { Subject } from "rxjs";

import { D3Selection, IAccessors, IDataSeries, IRenderContainers, IRendererEventPayload } from "../../core/common/types";
import { IXYScales } from "../../core/public-api";
import { GaugeUtil } from "../../gauge/gauge-util";
import { IGaugeThreshold } from "../../gauge/types";
import { IRenderSeries, RenderLayerName } from "../types";

import { BarAccessors, IBarAccessors } from "./accessors/bar-accessors";
import { barAccessors } from "./accessors/bar-accessors-fn";
import { barScales } from "./bar-scales";
import { LinearGaugeThresholdsRenderer } from "./linear-gauge-thresholds-renderer";

describe("LinearGaugeThresholdsRenderer >", () => {
    let renderer: LinearGaugeThresholdsRenderer;
    let testThresholds: IGaugeThreshold[];
    let svg: D3Selection<SVGSVGElement> | any;
    let renderSeries: IRenderSeries<BarAccessors>;
    let dataSeries: IDataSeries<IAccessors>;
    let accessors: IBarAccessors;
    let scales: IXYScales;
    const containers: IRenderContainers = {};

    beforeEach(() => {
        renderer = new LinearGaugeThresholdsRenderer();
        svg = select(document.createElement("div")).append("svg");
        containers[RenderLayerName.data] = svg.append("g");
        testThresholds = [{ value: 3 }, { value: 7 }, { value: 9 }];
    });

    describe("draw", () => {
        let thresholdMarkers: D3Selection;

        describe("vertical gauge", () => {
            beforeEach(() => {
                accessors = barAccessors();
                scales = barScales();
                scales.x.domain(["gauge"]);
                dataSeries = GaugeUtil.generateThresholdSeries(5, 10, testThresholds, accessors, scales, renderer);

                renderSeries = {
                    dataSeries: dataSeries as IDataSeries<BarAccessors, any>,
                    containers,
                    scales,
                };

                renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
                thresholdMarkers = containers[RenderLayerName.data].selectAll("circle");
            });

            it("should render the correct number of threshold markers", () => {
                expect(thresholdMarkers.nodes().length).toEqual(testThresholds.length);
            });

            it("should position the threshold markers correctly", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    expect(node.getAttribute("cx")).toEqual((renderSeries.scales.x.convert(accessors?.data?.endX?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString());
                    expect(node.getAttribute("cy")).toEqual((renderSeries.scales.y.convert(accessors?.data?.endY?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString());
                });
            });

            it("should assign marker fill color based on the hit value", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    // only the first threshold is hit for these tests
                    expect(node.getAttribute("style")).toEqual(`fill: var(--nui-color-icon-${i === 0 ? "light" : "default"}); stroke-width: 0;`);
                });
            });
        });

        describe("horizontal gauge", () => {
            beforeEach(() => {
                accessors = barAccessors({ horizontal: true });
                scales = barScales({ horizontal: true });
                scales.y.domain(["gauge"]);
                dataSeries = GaugeUtil.generateThresholdSeries(5, 10, testThresholds, accessors, scales, renderer);

                renderSeries = {
                    dataSeries: dataSeries as IDataSeries<BarAccessors, any>,
                    containers,
                    scales,
                };

                renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
                thresholdMarkers = containers[RenderLayerName.data].selectAll("circle");
            });

            it("should render the correct number of threshold markers", () => {
                expect(thresholdMarkers.nodes().length).toEqual(testThresholds.length);
            });

            it("should position the threshold markers correctly", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    expect(node.getAttribute("cx")).toEqual((renderSeries.scales.x.convert(accessors?.data?.endX?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString());
                    expect(node.getAttribute("cy")).toEqual((renderSeries.scales.y.convert(accessors?.data?.endY?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString());
                });
            });

            it("should assign marker fill color based on the hit value", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    // only the first threshold is hit for these tests
                    expect(node.getAttribute("style")).toEqual(`fill: var(--nui-color-icon-${i === 0 ? "light" : "default"}); stroke-width: 0;`);
                });
            });
        });

    });
});
