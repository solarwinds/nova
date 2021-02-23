import { arc, Arc, DefaultArcObject } from "d3-shape";

import { DATA_POINT_NOT_FOUND, INTERACTION_DATA_POINTS_EVENT } from "../../../constants";
import { GaugeMode } from "../../../gauge/constants";
import { GaugeUtil } from "../../../gauge/gauge-util";
import { RadialAccessors } from "../../../renderers/radial/accessors/radial-accessors";
import { RadialGaugeRenderingUtil } from "../../../renderers/radial/gauge/radial-gauge-rendering-util";
import { radialGrid } from "../../../renderers/radial/radial-grid";
import { RadialRenderer } from "../../../renderers/radial/radial-renderer";
import { Chart } from "../../chart";
import { D3Selection, IAccessors, IChartAssistSeries } from "../../common/types";

import { GAUGE_LABELS_CONTAINER_CLASS } from "./constants";
import { RadialGaugeLabelsPlugin } from "./radial-gauge-labels-plugin";

describe("RadialGaugeThresholdLabelsPlugin >", () => {

    let chart: Chart;
    let plugin: RadialGaugeLabelsPlugin;
    let labelsGroup: D3Selection;
    let labels: D3Selection;
    const thresholds = [{ value: 3 }, { value: 7 }];
    let dataSeries: IChartAssistSeries<IAccessors>;
    let labelGenerator: Arc<any, DefaultArcObject>;
    let labelData: any[];

    beforeEach(() => {
        chart = new Chart(radialGrid());
        plugin = new RadialGaugeLabelsPlugin();
        chart.addPlugin(plugin);

        const { accessors, scales, thresholdsRenderer } = GaugeUtil.getGaugeAttributes(GaugeMode.Radial);
        const element = document.createElement("div");
        chart.build(element);
        dataSeries = GaugeUtil.generateThresholdSeries(5, 10, thresholds, accessors as RadialAccessors, scales, thresholdsRenderer);
        chart.update([dataSeries]);
        chart.updateDimensions();
        labelsGroup = plugin.chart.getGrid().getLasagna().getLayerContainer(GAUGE_LABELS_CONTAINER_CLASS).select(`.${GAUGE_LABELS_CONTAINER_CLASS}`);
        labels = labelsGroup.selectAll("text");

        const renderer = dataSeries.renderer as RadialRenderer;
        const labelRadius = renderer?.getOuterRadius(dataSeries.scales.r.range() ?? [0, 0], 0) + (plugin.config.labelPadding as number);
        labelGenerator = arc().outerRadius(labelRadius).innerRadius(labelRadius);
        labelData = RadialGaugeRenderingUtil.generateThresholdData(dataSeries.data);
    });

    it("should render the same number of threshold labels as there are thresholds", () => {
        expect(labels.nodes().length).toEqual(thresholds.length);
    });

    it("should position the threshold markers correctly", () => {
        labels.nodes().forEach((node: SVGElement, i: number) => {
            expect(node.getAttribute("transform")).toEqual(`translate(${labelGenerator.centroid(labelData[i])})`);
        });
    });

    it("should render the threshold values as text", () => {
        labels.nodes().forEach((node, index) => {
            expect(node.textContent).toEqual(thresholds[index].value.toString());
        });
    });

    describe("Label opacity", () => {
        it("should render the threshold labels with zero opacity initially", () => {
            expect(labelsGroup?.node()?.getAttribute("style")).toEqual("opacity: 0;");
        });

        describe("INTERACTION_DATA_POINTS_EVENT", () => {
            it("should set the label group opacity to 1", () => {
                chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next({ data: { dataPoints: { quantity: { index: 0 } } } });
                expect(labelsGroup?.node()?.getAttribute("style")).toEqual("opacity: 1;");
            });

            it("should set the label group opacity to 0", () => {
                chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next({ data: { dataPoints: { quantity: { index: 0 } } } });
                chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next({ data: { dataPoints: { quantity: { index: DATA_POINT_NOT_FOUND } } } });
                expect(labelsGroup?.node()?.getAttribute("style")).toEqual("opacity: 0;");
            });
        });

    });

});
