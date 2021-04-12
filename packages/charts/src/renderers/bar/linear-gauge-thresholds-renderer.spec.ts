import { select } from "d3";
import { Subject } from "rxjs";

import { D3Selection, IAccessors, IDataSeries, IRenderContainers, IRendererEventPayload } from "../../core/common/types";
import { GaugeMode } from "../../gauge/constants";
import { GaugeUtil } from "../../gauge/gauge-util";
import { IGaugeAttributes, IGaugeConfig } from "../../gauge/types";
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

    beforeEach(() => {
        renderer = new LinearGaugeThresholdsRenderer();
        svg = select(document.createElement("div")).append("svg");
        containers[RenderLayerName.unclippedData] = svg.append("g");
        gaugeConfig = {
            value: 5,
            max: 10,
            thresholds: [3, 7, 9],
        };
    });

    describe("draw", () => {
        let thresholdMarkers: D3Selection;

        describe("vertical gauge", () => {
            let gaugeAttributes: IGaugeAttributes;

            beforeEach(() => {
                gaugeAttributes = GaugeUtil.getGaugeAttributes(GaugeMode.Vertical);
                gaugeAttributes.scales.x.domain(["gauge"]);
                dataSeries = GaugeUtil.generateThresholdSeries(gaugeConfig, gaugeAttributes);

                renderSeries = {
                    dataSeries: dataSeries as IDataSeries<BarAccessors, any>,
                    containers,
                    scales: gaugeAttributes.scales,
                };

                renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
                thresholdMarkers = containers[RenderLayerName.unclippedData].selectAll("circle");
            });

            it("should render the correct number of threshold markers", () => {
                expect(thresholdMarkers.nodes().length).toEqual(gaugeConfig.thresholds.length);
            });

            it("should position the threshold markers correctly", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    expect(node.getAttribute("cx")).toEqual(
                        (renderSeries.scales.x.convert(gaugeAttributes.accessors?.data?.endX?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString()
                    );
                    expect(node.getAttribute("cy")).toEqual(
                        (renderSeries.scales.y.convert(gaugeAttributes.accessors?.data?.endY?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString()
                    );
                });
            });

            it("should assign marker fill color based on the hit value", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    // only the first threshold is hit for these tests
                    expect(node.getAttribute("style")).toEqual(`fill: var(--nui-color-${i === 0 ? "text-light" : "icon-default"}); stroke-width: 0;`);
                });
            });
        });

        describe("horizontal gauge", () => {
            let gaugeAttributes: IGaugeAttributes;

            beforeEach(() => {
                gaugeAttributes = GaugeUtil.getGaugeAttributes(GaugeMode.Horizontal);
                gaugeAttributes.scales.y.domain(["gauge"]);

                dataSeries = GaugeUtil.generateThresholdSeries(gaugeConfig, gaugeAttributes);

                renderSeries = {
                    dataSeries: dataSeries as IDataSeries<BarAccessors, any>,
                    containers,
                    scales: gaugeAttributes.scales,
                };

                renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
                thresholdMarkers = containers[RenderLayerName.unclippedData].selectAll("circle");
            });

            it("should render the correct number of threshold markers", () => {
                expect(thresholdMarkers.nodes().length).toEqual(gaugeConfig.thresholds.length);
            });

            it("should position the threshold markers correctly", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    expect(node.getAttribute("cx")).toEqual(
                        (renderSeries.scales.x.convert(gaugeAttributes.accessors?.data?.endX?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString()
                    );
                    expect(node.getAttribute("cy")).toEqual(
                        (renderSeries.scales.y.convert(gaugeAttributes.accessors?.data?.endY?.(dataSeries.data[i], i, dataSeries.data, dataSeries))).toString()
                    );
                });
            });

            it("should assign marker fill color based on the hit value", () => {
                thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                    // only the first threshold is hit for these tests
                    expect(node.getAttribute("style")).toEqual(`fill: var(--nui-color-${i === 0 ? "text-light" : "icon-default"}); stroke-width: 0;`);
                });
            });
        });

    });
});
