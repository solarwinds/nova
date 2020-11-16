import { Arc, arc, DefaultArcObject, pie } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { IGaugeThresholdsRendererConfig, IRendererEventPayload } from "../../core/common/types";
import { IGaugeThreshold } from "../../gauge/types";
import { IRenderSeries, RenderLayerName } from "../types";

import { IRadialAccessors } from "./accessors/radial-accessors";
import { RadialRenderer } from "./radial-renderer";

/**
 * @ignore Default configuration for Gauge Thresholds Renderer
 */
export const DEFAULT_GAUGE_THRESHOLDS_RENDERER_CONFIG: IGaugeThresholdsRendererConfig = {};

/**
 * @ignore Renderer for drawing threshold level indicators for gauges
 */
export class GaugeThresholdsRenderer extends RadialRenderer {
    /**
     * Creates an instance of GaugeThresholdsRenderer.
     * @param {IGaugeThresholdsRendererConfig} [config]
     * Renderer configuration object. Defaults to `DEFAULT_GAUGE_THRESHOLDS_RENDERER_CONFIG` constant value.
     */
    constructor(config: IGaugeThresholdsRendererConfig = {}) {
        super(config);
        this.config = defaultsDeep(this.config, DEFAULT_GAUGE_THRESHOLDS_RENDERER_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<IRadialAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {
        const dataContainer = renderSeries.containers[RenderLayerName.data];
        const data = renderSeries.dataSeries.data;

        this.segmentWidth = this.config.annularWidth;
        const innerRadius = this.getInnerRadius(renderSeries.scales.r.range(), 0);
        const arcGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(this.getOuterRadius(renderSeries.scales.r.range(), 0))
            .innerRadius(innerRadius >= 0 ? innerRadius : 0);

        const selection = dataContainer.selectAll("circle.threshold").data(this.generateCircleData(data));
        selection.exit().remove();
        selection.enter()
            .append("circle")
            .attr("class", "threshold")
            .merge(selection as any)
            .attr("cx", d => arcGenerator.centroid(d)[0])
            .attr("cy", d => arcGenerator.centroid(d)[1])
            .attr("r", 4)
            .style("fill", (d, i) => data[i].hit ? "var(--nui-color-text-light)" : "var(--nui-color-text-default)")
            .style("stroke-width", 0);
    }

    public generateArcData(data: any[]) {
        // arcs with a value of zero serve as the threshold points
        const arcData: number[] = Array(data.length * 2 - 1).fill(0);
        data.forEach((d: IGaugeThreshold, i: number) => {
            // arcs with a non-zero value serve as the space between the threshold points
            arcData[i * 2] = i === 0 ? d.value : d.value - data[i - 1].value;
        });
        return arcData;
    }

    public generateCircleData(data: any[]) {
        const arcData: number[] = this.generateArcData(data);
        const circleData: any[] = [];
        const pieGenerator = pie().sort(null);
        const arcsForCircles = pieGenerator(arcData);

        arcsForCircles.forEach((arcDatum: any, i: number) => {
            // Drawing circles at threshold points
            if (i % 2 === 1) {
                circleData.push(arcDatum);
            }
        });
        return circleData;
    }

    public getInnerRadius(range: number[], index: number): number {
        if (isUndefined(this.segmentWidth)) {
            throw new Error("Can't compute inner radius");
        }
        return range[1] - range[0] - this.segmentWidth;
    }
}
