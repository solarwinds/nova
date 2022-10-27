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

import cloneDeep from "lodash/cloneDeep";
import defaultsDeep from "lodash/defaultsDeep";
import { Subject } from "rxjs";

import { STANDARD_RENDER_LAYERS } from "../../constants";
import {
    ILasagnaLayer,
    ILinearGaugeThresholdsRendererConfig,
    IRendererEventPayload,
} from "../../core/common/types";
import { StandardGaugeThresholdMarkerRadius } from "../../gauge/constants";
import { IRectangleAccessors } from "../accessors/rectangle-accessors";
import { GAUGE_THRESHOLD_MARKER_CLASS } from "../constants";
import { IRenderSeries, RenderLayerName } from "../types";
import { BarRenderer } from "./bar-renderer";

/**
 * Default configuration for Linear Gauge Thresholds Renderer
 */
export const DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG: ILinearGaugeThresholdsRendererConfig =
    {
        markerRadius: StandardGaugeThresholdMarkerRadius.Large,
        enabled: true,
    };

/**
 * Renderer for drawing threshold level indicators for gauges
 */
export class LinearGaugeThresholdsRenderer extends BarRenderer {
    /**
     * Creates an instance of LinearGaugeThresholdsRenderer.
     * @param {ILinearGaugeThresholdsRendererConfig} [config]
     * Renderer configuration object. Defaults to `DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG` constant value.
     */
    constructor(public config: ILinearGaugeThresholdsRendererConfig = {}) {
        super(config);
        this.config = defaultsDeep(
            this.config,
            DEFAULT_LINEAR_GAUGE_THRESHOLDS_RENDERER_CONFIG
        );
    }

    /** See {@link Renderer#draw} */
    public draw(
        renderSeries: IRenderSeries<IRectangleAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        const dataContainer =
            renderSeries.containers[RenderLayerName.unclippedData];
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;

        const data = cloneDeep(this.config.enabled ? dataSeries.data : []);

        // last value in the thresholds series is the max value of the gauge (needed by RadialGaugeThresholdsRenderer).
        // removing this value to avoid rendering a marker for it
        data.pop();

        const markerSelection = dataContainer
            .selectAll(`circle.${GAUGE_THRESHOLD_MARKER_CLASS}`)
            .data(data);

        markerSelection.exit().remove();
        markerSelection
            .enter()
            .append("circle")
            .attr("class", GAUGE_THRESHOLD_MARKER_CLASS)
            .merge(markerSelection as any)
            .attr("cx", (d, i) =>
                renderSeries.scales.x.convert(
                    accessors?.data?.endX?.(d, i, dataSeries.data, dataSeries)
                )
            )
            .attr("cy", (d, i) =>
                renderSeries.scales.y.convert(
                    accessors?.data?.endY?.(d, i, dataSeries.data, dataSeries)
                )
            )
            .attr("r", this.config.markerRadius as number)
            .style(
                "fill",
                (d, i) =>
                    `var(--nui-color-${
                        data[i].hit ? "text-light" : "icon-default"
                    })`
            )
            .style("stroke-width", 0);
    }

    /** See {@link Renderer#getRequiredLayers} */
    public getRequiredLayers(): ILasagnaLayer[] {
        return [STANDARD_RENDER_LAYERS[RenderLayerName.unclippedData]];
    }
}
