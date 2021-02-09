import { Arc, arc, DefaultArcObject, pie } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { IRadialGaugeThresholdsRendererConfig, IRendererEventPayload } from "../../core/common/types";
import { IRenderSeries, RenderLayerName } from "../types";

import { IRadialAccessors } from "./accessors/radial-accessors";
import { GaugeRenderingUtils } from "./gauge-rendering-utils";
import { RadialRenderer } from "./radial-renderer";

/**
 * @ignore Default configuration for Radial Gauge Thresholds Renderer
 */
export const DEFAULT_RADIAL_GAUGE_THRESHOLDS_RENDERER_CONFIG: IRadialGaugeThresholdsRendererConfig = {};

/**
 * @ignore Renderer for drawing threshold level indicators for gauges
 */
export class RadialGaugeThresholdsRenderer extends RadialRenderer {
    public static readonly MARKER_CLASS = "threshold-marker";

    /**
     * Creates an instance of RadialGaugeThresholdsRenderer.
     * @param {IRadialGaugeThresholdsRendererConfig} [config]
     * Renderer configuration object. Defaults to `DEFAULT_RADIAL_GAUGE_THRESHOLDS_RENDERER_CONFIG` constant value.
     */
    constructor(config: IRadialGaugeThresholdsRendererConfig = {}) {
        super(config);
        this.config = defaultsDeep(this.config, DEFAULT_RADIAL_GAUGE_THRESHOLDS_RENDERER_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<IRadialAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {
        const dataContainer = renderSeries.containers[RenderLayerName.data];

        const data = renderSeries.dataSeries.data;

        this.segmentWidth = this.config.annularWidth || 0;
        const innerRadius = this.getInnerRadius(renderSeries.scales.r.range(), 0);
        const markerGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(this.getOuterRadius(renderSeries.scales.r.range(), 0))
            .innerRadius(innerRadius >= 0 ? innerRadius : 0);

        const markerSelection = dataContainer.selectAll(`circle.${RadialGaugeThresholdsRenderer.MARKER_CLASS}`)
            .data(GaugeRenderingUtils.generateThresholdData(data));
        markerSelection.exit().remove();
        markerSelection.enter()
            .append("circle")
            .attr("class", RadialGaugeThresholdsRenderer.MARKER_CLASS)
            .merge(markerSelection as any)
            .attr("cx", d => markerGenerator.centroid(d)[0])
            .attr("cy", d => markerGenerator.centroid(d)[1])
            .attr("r", 4)
            .style("fill", (d, i) => data[i].hit ? "var(--nui-color-text-light)" : "var(--nui-color-text-default)")
            .style("stroke-width", 0);
    }

    public getInnerRadius(range: number[], index: number): number {
        if (isUndefined(this.segmentWidth)) {
            throw new Error("Can't compute inner radius");
        }
        return range[1] - range[0] - this.segmentWidth;
    }
}
