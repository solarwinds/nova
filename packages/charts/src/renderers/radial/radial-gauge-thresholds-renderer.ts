import { Arc, arc, DefaultArcObject, pie } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { IRadialGaugeThresholdsRendererConfig, IRendererEventPayload } from "../../core/common/types";
import { IGaugeThreshold } from "../../gauge/types";
import { IRenderSeries, RenderLayerName } from "../types";

import { IRadialAccessors } from "./accessors/radial-accessors";
import { RadialRenderer } from "./radial-renderer";

/**
 * @ignore Default configuration for Radial Gauge Thresholds Renderer
 */
export const DEFAULT_RADIAL_GAUGE_THRESHOLDS_RENDERER_CONFIG: IRadialGaugeThresholdsRendererConfig = {};

/**
 * @ignore Renderer for drawing threshold level indicators for gauges
 */
export class RadialGaugeThresholdsRenderer extends RadialRenderer {
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

        let gaugeThresholdsGroup = dataContainer.select(".gauge-thresholds");
        if (gaugeThresholdsGroup.empty()) {
            gaugeThresholdsGroup = dataContainer.append("svg:g")
                .attr("class", "gauge-thresholds");
        }

        const data = renderSeries.dataSeries.data;

        this.segmentWidth = this.config.annularWidth || 0;
        const innerRadius = this.getInnerRadius(renderSeries.scales.r.range(), 0);
        const markerGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(this.getOuterRadius(renderSeries.scales.r.range(), 0))
            .innerRadius(innerRadius >= 0 ? innerRadius : 0);

        const markerSelection = gaugeThresholdsGroup.selectAll("circle.threshold-marker").data(this.generateCircleData(data));
        markerSelection.exit().remove();
        markerSelection.enter()
            .append("circle")
            .attr("class", "threshold-marker")
            .merge(markerSelection as any)
            .attr("cx", d => markerGenerator.centroid(d)[0])
            .attr("cy", d => markerGenerator.centroid(d)[1])
            .attr("r", 4)
            .style("fill", (d, i) => data[i].hit ? "var(--nui-color-text-light)" : "var(--nui-color-text-default)")
            .style("stroke-width", 0);

        const labelRadius = this.getOuterRadius(renderSeries.scales.r.range(), 0) + 5;
        const labelGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(labelRadius)
            .innerRadius(labelRadius);

        const labelSelection = gaugeThresholdsGroup.selectAll("text.threshold-label").data(this.generateCircleData(data));
        labelSelection.exit().remove();
        labelSelection.enter()
            .append("text")
            .attr("class", "threshold-label")
            .merge(labelSelection as any)
            .attr("transform", (d) => `translate(${labelGenerator.centroid(d)})`)
            .style("text-anchor", (d) => this.getTextAnchor(d.startAngle))
            .style("alignment-baseline", (d) => this.getAlignmentBaseline(d.startAngle))
            .text((d, i) => data[i].value);
    }

    private getTextAnchor(angle: any): string {
        // pie charts start on the top, so we need to subtract Math.PI / 2 (90 degrees)
        const cosine = Math.cos(Number(angle.toFixed(2)) - Math.PI / 2);
        if (cosine > 0.5) {
            return "start";
        }

        if (cosine < -0.5) {
            return "end";
        }

        return "middle";
    }

    private getAlignmentBaseline(angle: any): string {
        // pie charts start on the top, so we need to add Math.PI / 2 (90 degrees)
        const sine = Math.sin(Number(angle.toFixed(2)) + Math.PI / 2);
        if (sine > 0.5) {
            return "text-after-edge";
        }

        if (sine < -0.5) {
            return "text-before-edge";
        }

        return "central";
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
