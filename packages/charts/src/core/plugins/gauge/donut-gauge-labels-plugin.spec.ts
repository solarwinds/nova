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

import { arc, Arc, DefaultArcObject } from "d3-shape";

import {
    DATA_POINT_NOT_FOUND,
    INTERACTION_DATA_POINTS_EVENT,
} from "../../../constants";
import { GaugeMode } from "../../../gauge/constants";
import { GaugeUtil } from "../../../gauge/gauge-util";
import { IGaugeConfig, GaugeThresholdDefs } from "../../../gauge/types";
import { DonutGaugeRenderingUtil } from "../../../renderers/radial/gauge/donut-gauge-rendering-util";
import { radialGrid } from "../../../renderers/radial/radial-grid-fn";
import { RadialRenderer } from "../../../renderers/radial/radial-renderer";
import { Chart } from "../../chart";
import {
    D3Selection,
    IAccessors,
    IChartAssistSeries,
} from "../../common/types";
import { GAUGE_LABELS_CONTAINER_CLASS } from "./constants";
import { DonutGaugeLabelsPlugin } from "./donut-gauge-labels-plugin";

describe("DonutGaugeLabelsPlugin >", () => {
    let chart: Chart;
    let plugin: DonutGaugeLabelsPlugin;
    let labelsGroup: D3Selection;
    let labels: D3Selection;
    const gaugeConfig: IGaugeConfig = {
        value: 5,
        max: 10,
        thresholds: GaugeUtil.createStandardThresholdsConfig(3, 7),
    };
    let dataSeries: IChartAssistSeries<IAccessors>;
    let labelGenerator: Arc<any, DefaultArcObject>;
    let labelData: any[];

    beforeEach(() => {
        chart = new Chart(radialGrid());
        plugin = new DonutGaugeLabelsPlugin();
        chart.addPlugin(plugin);

        const element = document.createElement("div");
        chart.build(element);

        dataSeries = GaugeUtil.generateThresholdSeries(
            gaugeConfig,
            GaugeUtil.generateRenderingAttributes(gaugeConfig, GaugeMode.Donut)
        );
        chart.update([dataSeries]);
        chart.updateDimensions();
        labelsGroup = plugin.chart
            .getGrid()
            .getLasagna()
            .getLayerContainer(GAUGE_LABELS_CONTAINER_CLASS)
            .select(`.${GAUGE_LABELS_CONTAINER_CLASS}`);
        labels = labelsGroup.selectAll("text");

        const renderer = dataSeries.renderer as RadialRenderer;
        const labelRadius =
            renderer?.getOuterRadius(dataSeries.scales.r.range() ?? [0, 0], 0) +
            (plugin.config.padding as number);
        labelGenerator = arc()
            .outerRadius(labelRadius)
            .innerRadius(labelRadius);
        labelData = DonutGaugeRenderingUtil.generateThresholdArcData(
            dataSeries.data
        );
    });

    it("should render the same number of threshold labels as there are thresholds", () => {
        expect(labels.nodes().length).toEqual(
            Object.keys(
                gaugeConfig.thresholds?.definitions as GaugeThresholdDefs
            ).length
        );
    });

    it("should position the threshold labels correctly", () => {
        labels.nodes().forEach((node: SVGElement, i: number) => {
            expect(node.getAttribute("transform")).toEqual(
                `translate(${labelGenerator.centroid(labelData[i])})`
            );
        });
    });

    it("should render the threshold values as text", () => {
        const thresholds =
            GaugeUtil.prepareThresholdsData(gaugeConfig).thresholds;
        labels.nodes().forEach((node, index) => {
            expect(node.textContent).toEqual(
                thresholds?.[index].value.toString() as string
            );
        });
    });

    describe("Label opacity", () => {
        it("should render the threshold labels with zero opacity initially", () => {
            expect(labelsGroup?.node()?.style.opacity).toEqual("0");
        });

        describe("INTERACTION_DATA_POINTS_EVENT", () => {
            it("should set the label group opacity to 1", () => {
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next({ data: { dataPoints: { quantity: { index: 0 } } } });
                expect(labelsGroup?.node()?.style.opacity).toEqual("1");
            });

            it("should set the label group opacity to 0", () => {
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next({ data: { dataPoints: { quantity: { index: 0 } } } });
                chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next({
                        data: {
                            dataPoints: {
                                quantity: { index: DATA_POINT_NOT_FOUND },
                            },
                        },
                    });
                expect(labelsGroup?.node()?.style.opacity).toEqual("0");
            });
        });
    });
});
