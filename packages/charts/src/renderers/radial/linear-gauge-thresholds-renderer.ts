import { IRectangleAccessors } from "../accessors/rectangle-accessors";
import { IRenderSeries, RenderLayerName } from "../types";
import { BarRenderer } from "../bar/bar-renderer";
import cloneDeep from "lodash/cloneDeep";
/**
 * @ignore Default configuration for Linear Gauge Thresholds Renderer
 */
// export const DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG: ILinearGaugeThresholdsRendererConfig = {};

/**
 * @ignore Renderer for drawing threshold level indicators for gauges
 */
export class LinearGaugeThresholdsRenderer extends BarRenderer {
    public static readonly MARKER_CLASS = "threshold-marker";

    /**
     * Creates an instance of RadialGaugeThresholdsRenderer.
     * @param {ILinearGaugeThresholdsRendererConfig} [config]
     * Renderer configuration object. Defaults to `DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG` constant value.
     */
    constructor(/* config: ILinearGaugeThresholdsRendererConfig = {} */) {
        super();
        // this.config = defaultsDeep(this.config, DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<IRectangleAccessors>): void {
        const dataContainer = renderSeries.containers[RenderLayerName.data];
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;

        const data = cloneDeep(dataSeries.data);

        // last value in the thresholds series is the max value of the gauge (needed by RadialGaugeThresholdsRenderer).
        // removing this value to avoid rendering a marker for it
        data.pop();

        const markerSelection = dataContainer.selectAll(`circle.${LinearGaugeThresholdsRenderer.MARKER_CLASS}`).data(data);

        markerSelection.exit().remove();
        markerSelection.enter()
            .append("circle")
            .attr("class", LinearGaugeThresholdsRenderer.MARKER_CLASS)
            .merge(markerSelection as any)
            .attr("cx", (d, i) => renderSeries.scales.x.convert(accessors?.data?.endX?.(d, i, dataSeries.data, dataSeries)))
            .attr("cy", (d, i) => renderSeries.scales.y.convert(accessors?.data?.endY?.(d, i, dataSeries.data, dataSeries)))
            .attr("r", 4)
            .style("fill", (d, i) => data[i].hit ? "var(--nui-color-text-light)" : "var(--nui-color-icon-default)")
            .style("stroke-width", 0);
    }
}
