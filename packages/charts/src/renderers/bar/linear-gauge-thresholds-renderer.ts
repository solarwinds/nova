import cloneDeep from "lodash/cloneDeep";
import defaultsDeep from "lodash/defaultsDeep";
import { Subject } from "rxjs";

import { ILinearGaugeThresholdsRendererConfig, IRendererEventPayload } from "../../core/common/types";
import { IRectangleAccessors } from "../accessors/rectangle-accessors";
import { GAUGE_THRESHOLD_MARKER_CLASS } from "../constants";
import { IRenderSeries, RenderLayerName } from "../types";

import { BarRenderer } from "./bar-renderer";
/**
 * @ignore Default configuration for Linear Gauge Thresholds Renderer
 */
export const DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG: ILinearGaugeThresholdsRendererConfig = {};

/**
 * @ignore Renderer for drawing threshold level indicators for gauges
 */
export class LinearGaugeThresholdsRenderer extends BarRenderer {
    /**
     * Creates an instance of RadialGaugeThresholdsRenderer.
     * @param {ILinearGaugeThresholdsRendererConfig} [config]
     * Renderer configuration object. Defaults to `DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG` constant value.
     */
    constructor(config: ILinearGaugeThresholdsRendererConfig = {}) {
        super(config);
        this.config = defaultsDeep(this.config, DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<IRectangleAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {
        const dataContainer = renderSeries.containers[RenderLayerName.data];
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;

        const data = cloneDeep(dataSeries.data);

        // last value in the thresholds series is the max value of the gauge (needed by RadialGaugeThresholdsRenderer).
        // removing this value to avoid rendering a marker for it
        data.pop();

        const markerSelection = dataContainer.selectAll(`circle.${GAUGE_THRESHOLD_MARKER_CLASS}`).data(data);

        markerSelection.exit().remove();
        markerSelection.enter()
            .append("circle")
            .attr("class", GAUGE_THRESHOLD_MARKER_CLASS)
            .merge(markerSelection as any)
            .attr("cx", (d, i) => renderSeries.scales.x.convert(accessors?.data?.endX?.(d, i, dataSeries.data, dataSeries)))
            .attr("cy", (d, i) => renderSeries.scales.y.convert(accessors?.data?.endY?.(d, i, dataSeries.data, dataSeries)))
            .attr("r", 4)
            .style("fill", (d, i) => `var(--nui-color-icon-${data[i].hit ? "light" : "default"})`)
            .style("stroke-width", 0);
    }
}
