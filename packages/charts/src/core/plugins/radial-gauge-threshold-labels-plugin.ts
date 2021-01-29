import { Arc, arc, DefaultArcObject } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DATA_POINT_NOT_FOUND, INTERACTION_DATA_POINTS_EVENT } from "../../constants";
import { GaugeRenderingUtils } from "../../renderers/radial/gauge-rendering-utils";
import { RadialGaugeThresholdsRenderer } from "../../renderers/radial/radial-gauge-thresholds-renderer";
import { ChartPlugin } from "../common/chart-plugin";
import { D3Selection, IAccessors, IChartEvent, IChartSeries } from "../common/types";

/**
 * @ignore
 * Configuration for the radial value labels plugin */
// tslint:disable-next-line: no-empty-interface
export interface IRadialGaugeThresholdLabelsPluginConfig { }

/**
 * @ignore
 * TODO
 */
export class RadialGaugeThresholdLabelsPlugin extends ChartPlugin {
    public static readonly CSS_GROUP_CLASS = "gauge-threshold-labels";
    public static readonly CSS_LABEL_CLASS = "threshold-label";

    /** The default plugin configuration */
    public DEFAULT_CONFIG: IRadialGaugeThresholdLabelsPluginConfig = {};

    private destroy$ = new Subject();
    private gaugeThresholdLabelsLayer: D3Selection<SVGElement>;

    constructor(public config: IRadialGaugeThresholdLabelsPluginConfig = {}) {
        super();
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    public initialize(): void {
        this.gaugeThresholdLabelsLayer = this.chart.getGrid().getLasagna().addLayer({
            name: RadialGaugeThresholdLabelsPlugin.CSS_GROUP_CLASS,
            order: 900,
            clipped: false,
        });

        this.chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT as string).pipe(
            takeUntil(this.destroy$)
        ).subscribe((event: IChartEvent) => {
            const gaugeThresholdLabelsGroup = this.gaugeThresholdLabelsLayer.select(`.${RadialGaugeThresholdLabelsPlugin.CSS_GROUP_CLASS}`);
            if (!gaugeThresholdLabelsGroup.empty()) {
                const dataPoints = event.data.dataPoints;
                const labelOpacity = Object.keys(dataPoints).find((key, index) => dataPoints[key].index === DATA_POINT_NOT_FOUND) ? 0 : 1;
                gaugeThresholdLabelsGroup.style("opacity", labelOpacity);
            }
        });
    }

    public updateDimensions() {
        const thresholdsSeries = this.chart.getDataManager().chartSeriesSet.find((series: IChartSeries<IAccessors<any>>) =>
            series.renderer instanceof RadialGaugeThresholdsRenderer);
        const labelRadius = (thresholdsSeries?.renderer as RadialGaugeThresholdsRenderer).getOuterRadius(thresholdsSeries?.scales.r.range() ?? [0, 0], 0) + 5;
        if (isUndefined(labelRadius)) {
            throw new Error("Radius is undefined");
        }

        const data = thresholdsSeries?.data;
        if (isUndefined(data)) {
            throw new Error("Gauge threshold series data is undefined");
        }

        let gaugeThresholdsLabelsGroup = this.gaugeThresholdLabelsLayer.select(`.${RadialGaugeThresholdLabelsPlugin.CSS_GROUP_CLASS}`);
        if (gaugeThresholdsLabelsGroup.empty()) {
            gaugeThresholdsLabelsGroup = this.gaugeThresholdLabelsLayer.append("svg:g")
                .attr("class", RadialGaugeThresholdLabelsPlugin.CSS_GROUP_CLASS);
        }

        const labelGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(labelRadius)
            .innerRadius(labelRadius);

        const labelSelection = gaugeThresholdsLabelsGroup.selectAll(`text.${RadialGaugeThresholdLabelsPlugin.CSS_LABEL_CLASS}`)
            .data(GaugeRenderingUtils.generateThresholdsData(data));
        labelSelection.exit().remove();
        labelSelection.enter()
            .append("text")
            .attr("class", RadialGaugeThresholdLabelsPlugin.CSS_LABEL_CLASS)
            .merge(labelSelection as any)
            .attr("transform", (d) => `translate(${labelGenerator.centroid(d)})`)
            .style("text-anchor", (d) => this.getTextAnchor(d.startAngle))
            .style("alignment-baseline", (d) => this.getAlignmentBaseline(d.startAngle))
            .text((d, i) => data[i].value);
    }

    public destroy(): void {
        if (this.destroy$) {
            this.destroy$.next();
            this.destroy$.complete();
        }
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

}
