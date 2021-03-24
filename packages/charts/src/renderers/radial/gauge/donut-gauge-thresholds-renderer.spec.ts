import { arc, Arc, DefaultArcObject, select } from "d3";
import { Subject } from "rxjs";

import { D3Selection, IAccessors, IDataSeries, IRenderContainers, IRendererEventPayload } from "../../../core/common/types";
import { GaugeMode } from "../../../gauge/constants";
import { GaugeUtil } from "../../../gauge/gauge-util";
import { IGaugeSeriesConfig } from "../../../gauge/types";
import { IRenderSeries, RenderLayerName } from "../../types";
import { RadialAccessors } from "../accessors/radial-accessors";

import { DonutGaugeRenderingUtil } from "./donut-gauge-rendering-util";
import { DonutGaugeThresholdsRenderer } from "./donut-gauge-thresholds-renderer";

describe("DonutGaugeThresholdsRenderer >", () => {
    let renderer: DonutGaugeThresholdsRenderer;
    let seriesConfig: IGaugeSeriesConfig;
    let svg: D3Selection<SVGSVGElement> | any;
    let renderSeries: IRenderSeries<RadialAccessors>;
    let dataSeries: IDataSeries<IAccessors>;
    const containers: IRenderContainers = {};

    beforeEach(() => {
        renderer = new DonutGaugeThresholdsRenderer();
        svg = select(document.createElement("div")).append("svg");
        containers[RenderLayerName.data] = svg.append("g");
        seriesConfig = {
            value: 5,
            max: 10,
            thresholds: [3, 7, 9],
        };

        const gaugeAttributes = GaugeUtil.getGaugeAttributes(GaugeMode.Donut);
        dataSeries = GaugeUtil.generateThresholdSeries(seriesConfig, gaugeAttributes);

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
            thresholdMarkers = containers[RenderLayerName.data].selectAll("circle");

            const innerRadius = renderer.getInnerRadius(renderSeries.scales.r.range(), 0);
            arcGenerator = arc()
                .outerRadius(renderer.getOuterRadius(renderSeries.scales.r.range(), 0))
                .innerRadius(innerRadius >= 0 ? innerRadius : 0);
            markerData = DonutGaugeRenderingUtil.generateThresholdData(renderSeries.dataSeries.data);
        });

        it("should render the correct number of threshold markers", () => {
            expect(thresholdMarkers.nodes().length).toEqual(seriesConfig.thresholds.length);
        });

        it("should position the threshold markers correctly", () => {
            thresholdMarkers.nodes().forEach((node: SVGElement, i: number) => {
                expect(node.getAttribute("cx")).toEqual(arcGenerator.centroid(markerData[i])[0].toString());
                expect(node.getAttribute("cy")).toEqual(arcGenerator.centroid(markerData[i])[1].toString());
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
