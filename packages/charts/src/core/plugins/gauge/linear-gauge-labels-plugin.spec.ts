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

import { MOUSE_ACTIVE_EVENT } from "../../../constants";
import { linearGaugeGridConfig } from "../../../core/grid/config/linear-gauge-grid-config-fn";
import { GaugeMode } from "../../../gauge/constants";
import { GaugeUtil } from "../../../gauge/gauge-util";
import { IGaugeConfig, GaugeThresholdDefs } from "../../../gauge/types";
import { Chart } from "../../chart";
import {
    D3Selection,
    IAccessors,
    IChartAssistSeries,
} from "../../common/types";
import { XYGridConfig } from "../../grid/config/xy-grid-config";
import { XYGrid } from "../../grid/xy-grid";
import { GAUGE_LABELS_CONTAINER_CLASS } from "./constants";
import { LinearGaugeLabelsPlugin } from "./linear-gauge-labels-plugin";

describe("LinearGaugeLabelsPlugin >", () => {
    let chart: Chart;
    let gridConfig: XYGridConfig;
    let plugin: LinearGaugeLabelsPlugin;
    let labelsGroup: D3Selection;
    let labels: D3Selection;
    let element: HTMLDivElement;
    const gaugeConfig: IGaugeConfig = {
        value: 5,
        max: 10,
        thresholds: GaugeUtil.createStandardThresholdsConfig(3, 7),
    };
    let dataSeries: IChartAssistSeries<IAccessors>;

    beforeEach(() => {
        gridConfig = linearGaugeGridConfig(
            GaugeMode.Horizontal
        ) as XYGridConfig;
        chart = new Chart(new XYGrid(gridConfig));
        plugin = new LinearGaugeLabelsPlugin();
        chart.addPlugin(plugin);

        element = document.createElement("div");
        element.setAttribute("style", "width: 200px");
        document.body.appendChild(element);
        chart.build(element);

        dataSeries = GaugeUtil.generateThresholdSeries(
            gaugeConfig,
            GaugeUtil.generateRenderingAttributes(
                gaugeConfig,
                GaugeMode.Horizontal
            )
        );
        chart.update([dataSeries]);
        chart.updateDimensions();

        labelsGroup = plugin.chart
            .getGrid()
            .getLasagna()
            .getLayerContainer(GAUGE_LABELS_CONTAINER_CLASS)
            .select(`.${GAUGE_LABELS_CONTAINER_CLASS}`);
        labels = labelsGroup.selectAll("text");
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it("should render the same number of threshold labels as there are thresholds", () => {
        expect(labels.nodes().length).toEqual(
            Object.keys(
                gaugeConfig.thresholds?.definitions as GaugeThresholdDefs
            ).length
        );
    });

    describe("horizontal mode", () => {
        it("should position the threshold labels correctly", () => {
            labels.nodes().forEach((node: SVGElement, i: number) => {
                const expectedXTranslate = dataSeries.scales.x.convert(
                    dataSeries.data[i].value
                );
                const expectedYTranslate =
                    gridConfig.dimension.height() +
                    (plugin.config.padding as number);
                expect(node.getAttribute("transform")).toEqual(
                    `translate(${expectedXTranslate}, ${expectedYTranslate})`
                );
            });
        });

        it("should set the correct 'text-anchor' and 'dominant-baseline' on the threshold labels", () => {
            labels.nodes().forEach((node: SVGElement, i: number) => {
                expect(node.style.textAnchor).toEqual("middle");
                expect(node.style.dominantBaseline).toEqual("hanging");
            });
        });

        describe("with flipped labels", () => {
            beforeEach(() => {
                plugin.config.flippedLabels = true;
                // reset the margins to accommodate the label direction change
                gridConfig.dimension.margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
                chart.updateDimensions();
            });

            it("should position the threshold labels correctly", () => {
                labels.nodes().forEach((node: SVGElement, i: number) => {
                    const expectedXTranslate = dataSeries.scales.x.convert(
                        dataSeries.data[i].value
                    );
                    const expectedYTranslate = -(plugin.config
                        .padding as number);
                    expect(node.getAttribute("transform")).toEqual(
                        `translate(${expectedXTranslate}, ${expectedYTranslate})`
                    );
                });
            });

            it("should set the correct 'text-anchor' and 'dominant-baseline' on the threshold labels", () => {
                labels.nodes().forEach((node: SVGElement, i: number) => {
                    expect(node.style.textAnchor).toEqual("middle");
                    expect(node.style.dominantBaseline).toEqual(
                        "text-after-edge"
                    );
                });
            });
        });
    });

    describe("vertical mode", () => {
        beforeEach(() => {
            element.setAttribute("style", "height: 200px");
            gridConfig = linearGaugeGridConfig(GaugeMode.Vertical);
            chart.getGrid().config(gridConfig);
            dataSeries = GaugeUtil.generateThresholdSeries(
                gaugeConfig,
                GaugeUtil.generateRenderingAttributes(
                    gaugeConfig,
                    GaugeMode.Vertical
                )
            );
            chart.update([dataSeries]);
            chart.updateDimensions();
        });

        it("should position the threshold labels correctly", () => {
            labels.nodes().forEach((node: SVGElement, i: number) => {
                const expectedXTranslate =
                    gridConfig.dimension.width() +
                    (plugin.config.padding as number);
                const expectedYTranslate = dataSeries.scales.y.convert(
                    dataSeries.data[i].value
                );
                expect(node.getAttribute("transform")).toEqual(
                    `translate(${expectedXTranslate}, ${expectedYTranslate})`
                );
            });
        });

        it("should set the correct 'text-anchor' and 'dominant-baseline' on the threshold labels", () => {
            labels.nodes().forEach((node: SVGElement, i: number) => {
                expect(node.style.textAnchor).toEqual("start");
                expect(node.style.dominantBaseline).toEqual("central");
            });
        });

        describe("with flipped labels", () => {
            beforeEach(() => {
                plugin.config.flippedLabels = true;
                // reset the margins to accommodate the label direction change
                gridConfig.dimension.margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
                chart.updateDimensions();
            });

            it("should position the threshold labels correctly", () => {
                labels.nodes().forEach((node: SVGElement, i: number) => {
                    const expectedXTranslate = -(plugin.config
                        .padding as number);
                    const expectedYTranslate = dataSeries.scales.y.convert(
                        dataSeries.data[i].value
                    );
                    expect(node.getAttribute("transform")).toEqual(
                        `translate(${expectedXTranslate}, ${expectedYTranslate})`
                    );
                });
            });

            it("should set the correct 'text-anchor' and 'dominant-baseline' on the threshold labels", () => {
                labels.nodes().forEach((node: SVGElement, i: number) => {
                    expect(node.style.textAnchor).toEqual("end");
                    expect(node.style.dominantBaseline).toEqual("central");
                });
            });
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

        describe("MOUSE_ACTIVE_EVENT", () => {
            it("should set the label group opacity to 1", () => {
                chart
                    .getEventBus()
                    .getStream(MOUSE_ACTIVE_EVENT)
                    .next({ data: true });
                expect(labelsGroup?.node()?.style.opacity).toEqual("1");
            });

            it("should set the label group opacity to 0", () => {
                chart
                    .getEventBus()
                    .getStream(MOUSE_ACTIVE_EVENT)
                    .next({ data: true });
                chart
                    .getEventBus()
                    .getStream(MOUSE_ACTIVE_EVENT)
                    .next({ data: false });
                expect(labelsGroup?.node()?.style.opacity).toEqual("0");
            });
        });
    });
});
