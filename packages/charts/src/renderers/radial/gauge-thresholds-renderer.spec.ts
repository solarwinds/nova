import { arc, Arc, DefaultArcObject, select } from "d3";
import { Subject } from "rxjs";

import { D3Selection, IDataSeries, IRenderContainers, IRendererEventPayload } from "../../core/common/types";
import { GaugeService, IGaugeThreshold } from "../../gauge/public-api";
import { IRenderSeries, RenderLayerName } from "../types";

import { RadialAccessors } from "./accessors/radial-accessors";
import { GaugeRenderingUtils } from "./gauge-rendering-utils";
import { RadialGaugeThresholdsRenderer } from "./radial-gauge-thresholds-renderer";
import { radialScales } from "./radial-scales";

describe("GaugeThresholdsRenderer >", () => {
    let renderer: RadialGaugeThresholdsRenderer;
    let testThresholds: IGaugeThreshold[];
    let svg: D3Selection<SVGSVGElement> | any;
    let renderSeries: IRenderSeries<RadialAccessors>;
    let dataSeries: IDataSeries<RadialAccessors>;
    const accessors = new RadialAccessors();
    const scales = radialScales();
    const containers: IRenderContainers = {};
    const gaugeService = new GaugeService();

    beforeEach(() => {
        renderer = new RadialGaugeThresholdsRenderer();
        svg = select(document.createElement("div")).append("svg");
        containers[RenderLayerName.data] = svg.append("g");
        testThresholds = [{ value: 3 }, { value: 7 }, { value: 9 }];

        dataSeries = gaugeService.generateRadialThresholdSeries(5, 10, testThresholds, accessors, scales);

        renderSeries = {
            dataSeries,
            containers,
            scales,
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
            markerData = GaugeRenderingUtils.generateThresholdData(renderSeries.dataSeries.data);
        });

        it("should render the correct number of threshold markers", () => {
            expect(thresholdMarkers.nodes().length).toEqual(testThresholds.length);
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
                expect(node.getAttribute("style")).toEqual(`fill: var(--nui-color-text-${i === 0 ? "light" : "default"}); stroke-width: 0;`);
            });
        });
    });
});
