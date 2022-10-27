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

import { Arc, arc, DefaultArcObject } from "d3-shape";
import cloneDeep from "lodash/cloneDeep";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import {
    IDonutGaugeThresholdsRendererConfig,
    IRendererEventPayload,
} from "../../../core/common/types";
import { StandardGaugeThresholdMarkerRadius } from "../../../gauge/constants";
import { GAUGE_THRESHOLD_MARKER_CLASS } from "../../constants";
import { IRenderSeries, RenderLayerName } from "../../types";
import { IRadialAccessors } from "../accessors/radial-accessors";
import { RadialRenderer } from "../radial-renderer";
import { DonutGaugeRenderingUtil } from "./donut-gauge-rendering-util";

/**
 * Default configuration for DonutGaugeThresholdsRenderer
 */
export const DEFAULT_DONUT_GAUGE_THRESHOLDS_RENDERER_CONFIG: IDonutGaugeThresholdsRendererConfig =
    {
        markerRadius: StandardGaugeThresholdMarkerRadius.Large,
        enabled: true,
    };

/**
 * Renderer for drawing threshold level markers for donut gauges
 */
export class DonutGaugeThresholdsRenderer extends RadialRenderer {
    /**
     * Creates an instance of RadialGaugeThresholdsRenderer.
     * @param {IDonutGaugeThresholdsRendererConfig} [config]
     * Renderer configuration object. Defaults to `DEFAULT_DONUT_GAUGE_THRESHOLDS_RENDERER_CONFIG` constant value.
     */
    constructor(public config: IDonutGaugeThresholdsRendererConfig = {}) {
        super(config);
        this.config = defaultsDeep(
            this.config,
            DEFAULT_DONUT_GAUGE_THRESHOLDS_RENDERER_CONFIG
        );
    }

    /** See {@link Renderer#draw} */
    public draw(
        renderSeries: IRenderSeries<IRadialAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        const dataContainer = renderSeries.containers[RenderLayerName.data];

        const data = cloneDeep(
            this.config.enabled ? renderSeries.dataSeries.data : []
        );

        // ensure the data is sorted in ascending order by value since we're using it to calculate circle arcs
        data.sort((a, b) => a.value - b.value);

        this.segmentWidth = this.getSegmentWidth(renderSeries);

        const innerRadius = this.getInnerRadius(
            renderSeries.scales.r.range(),
            0
        );
        const markerGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(this.getOuterRadius(renderSeries.scales.r.range(), 0))
            .innerRadius(innerRadius >= 0 ? innerRadius : 0);

        const markerSelection = dataContainer
            .selectAll<SVGCircleElement, SVGCircleElement>(
                `circle.${GAUGE_THRESHOLD_MARKER_CLASS}`
            )
            .data(DonutGaugeRenderingUtil.generateThresholdArcData(data));
        markerSelection.exit().remove();
        markerSelection
            .enter()
            .append("circle")
            .attr("class", GAUGE_THRESHOLD_MARKER_CLASS)
            .merge(markerSelection)
            .attr("cx", (d) => markerGenerator.centroid(d)[0])
            .attr("cy", (d) => markerGenerator.centroid(d)[1])
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

    public getInnerRadius(range: number[], index: number): number {
        if (isUndefined(this.segmentWidth)) {
            throw new Error("Can't compute inner radius");
        }

        const calculatedRadius = range[1] - range[0] - this.segmentWidth;
        return calculatedRadius >= 0 ? calculatedRadius : 0;
    }
}
