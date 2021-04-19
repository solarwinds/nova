import { arc, Arc, DefaultArcObject } from "d3-shape";

import { DATA_POINT_NOT_FOUND, INTERACTION_DATA_POINTS_EVENT } from "../../../constants";
import { GaugeMode } from "../../../gauge/constants";
import { GaugeUtil } from "../../../gauge/gauge-util";
import { IGaugeSeriesConfig } from "../../../gauge/types";
import { DonutGaugeRenderingUtil } from "../../../renderers/radial/gauge/donut-gauge-rendering-util";
import { radialGrid } from "../../../renderers/radial/radial-grid-fn";
import { RadialRenderer } from "../../../renderers/radial/radial-renderer";
import { Chart } from "../../chart";
import { D3Selection, IAccessors, IChartAssistSeries } from "../../common/types";

import { GAUGE_LABELS_CONTAINER_CLASS } from "./constants";
import { DonutGaugeLabelsPlugin } from "./donut-gauge-labels-plugin";

describe("DonutGaugeLabelsPlugin >", () => {

    let chart: Chart;
    let plugin: DonutGaugeLabelsPlugin;
    let labelsGroup: D3Selection;
    let labels: D3Selection;
    const seriesConfig: IGaugeSeriesConfig = {
        value: 5,
        max: 10,
        thresholds: [3, 7],
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

        dataSeries = GaugeUtil.generateThresholdSeries(seriesConfig, GaugeUtil.getGaugeAttributes(GaugeMode.Donut));
        chart.update([dataSeries]);
        chart.updateDimensions();
        labelsGroup = plugin.chart.getGrid().getLasagna().getLayerContainer(GAUGE_LABELS_CONTAINER_CLASS).select(`.${GAUGE_LABELS_CONTAINER_CLASS}`);
        labels = labelsGroup.selectAll("text");

        const renderer = dataSeries.renderer as RadialRenderer;
        const labelRadius = renderer?.getOuterRadius(dataSeries.scales.r.range() ?? [0, 0], 0) + (plugin.config.padding as number);
        labelGenerator = arc().outerRadius(labelRadius).innerRadius(labelRadius);
        labelData = DonutGaugeRenderingUtil.generateThresholdData(dataSeries.data);
    });

    it("should render the same number of threshold labels as there are thresholds", () => {
        expect(labels.nodes().length).toEqual(seriesConfig.thresholds.length);
    });

    it("should position the threshold labels correctly", () => {
        labels.nodes().forEach((node: SVGElement, i: number) => {
            expect(node.getAttribute("transform")).toEqual(`translate(${labelGenerator.centroid(labelData[i])})`);
        });
    });

    it("should render the threshold values as text", () => {
        labels.nodes().forEach((node, index) => {
            expect(node.textContent).toEqual(seriesConfig.thresholds[index].toString());
        });
    });

    describe("Label opacity", () => {
        it("should render the threshold labels with zero opacity initially", () => {
            expect(labelsGroup?.node()?.style.opacity).toEqual("0");
        });

        describe("INTERACTION_DATA_POINTS_EVENT", () => {
            it("should set the label group opacity to 1", () => {
                chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next({ data: { dataPoints: { quantity: { index: 0 } } } });
                expect(labelsGroup?.node()?.style.opacity).toEqual("1");
            });

            it("should set the label group opacity to 0", () => {
                chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next({ data: { dataPoints: { quantity: { index: 0 } } } });
                chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next({ data: { dataPoints: { quantity: { index: DATA_POINT_NOT_FOUND } } } });
                expect(labelsGroup?.node()?.style.opacity).toEqual("0");
            });
        });

    });

});
