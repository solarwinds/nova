import { Arc, arc, DefaultArcObject } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DATA_POINT_NOT_FOUND, INTERACTION_DATA_POINTS_EVENT, STANDARD_RENDER_LAYERS } from "../../constants";
import { GaugeRenderingUtils } from "../../renderers/radial/gauge-rendering-utils";
import { RadialGaugeThresholdsRenderer } from "../../renderers/radial/radial-gauge-thresholds-renderer";
import { RenderLayerName } from "../../renderers/types";
import { ChartPlugin } from "../common/chart-plugin";
import { D3Selection, IAccessors, IChartEvent, IChartSeries } from "../common/types";
import { IAllAround } from "../grid/types";

/**
 * @ignore
 * Configuration for the radial value labels plugin
 */
export interface IRadialGaugeThresholdLabelsPluginConfig {
    gridMargin?: IAllAround<number>;
    labelPadding?: number;
    formatterName?: string;
}

/**
 * @ignore
 * A chart plugin that handles the rendering of labels for radial gauge thresholds
 */
export class RadialGaugeThresholdLabelsPlugin extends ChartPlugin {
    public static readonly CONTAINER_CLASS = "gauge-threshold-labels";
    public static readonly LABEL_CLASS = "threshold-label";
    public static readonly FORMATTER_NAME_DEFAULT = "threshold-label";
    public static readonly MARGIN_DEFAULT = 25;

    /** The default plugin configuration */
    public DEFAULT_CONFIG: IRadialGaugeThresholdLabelsPluginConfig = {
        gridMargin: {
            top: RadialGaugeThresholdLabelsPlugin.MARGIN_DEFAULT,
            right: RadialGaugeThresholdLabelsPlugin.MARGIN_DEFAULT,
            bottom: RadialGaugeThresholdLabelsPlugin.MARGIN_DEFAULT,
            left: RadialGaugeThresholdLabelsPlugin.MARGIN_DEFAULT,
        },
        labelPadding: 5,
        formatterName: RadialGaugeThresholdLabelsPlugin.FORMATTER_NAME_DEFAULT,
    };

    private destroy$ = new Subject();
    private lasagnaLayer: D3Selection<SVGElement>;

    constructor(public config: IRadialGaugeThresholdLabelsPluginConfig = {}) {
        super();
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    public initialize(): void {
        this.lasagnaLayer = this.chart.getGrid().getLasagna().addLayer({
            name: RadialGaugeThresholdLabelsPlugin.CONTAINER_CLASS,
            order: STANDARD_RENDER_LAYERS[RenderLayerName.data].order,
            clipped: false,
        });

        const gridConfig = this.chart.getGrid().config();
        gridConfig.dimension.margin = this.config.gridMargin as IAllAround<number>;

        this.chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT as string).pipe(
            takeUntil(this.destroy$)
        ).subscribe((event: IChartEvent) => {
            const gaugeThresholdLabelsGroup = this.lasagnaLayer.select(`.${RadialGaugeThresholdLabelsPlugin.CONTAINER_CLASS}`);
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
        const renderer = (thresholdsSeries?.renderer as RadialGaugeThresholdsRenderer);
        const labelRadius = renderer?.getOuterRadius(thresholdsSeries?.scales.r.range() ?? [0, 0], 0) + (this.config.labelPadding as number);
        if (isUndefined(labelRadius)) {
            throw new Error("Radius is undefined");
        }

        const data = thresholdsSeries?.data;
        if (isUndefined(data)) {
            throw new Error("Gauge threshold series data is undefined");
        }

        let gaugeThresholdsLabelsGroup = this.lasagnaLayer.select(`.${RadialGaugeThresholdLabelsPlugin.CONTAINER_CLASS}`);
        if (gaugeThresholdsLabelsGroup.empty()) {
            gaugeThresholdsLabelsGroup = this.lasagnaLayer.append("svg:g")
                .attr("class", RadialGaugeThresholdLabelsPlugin.CONTAINER_CLASS)
                .style("opacity", 0);
        }

        const labelGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(labelRadius)
            .innerRadius(labelRadius);

        const formatter = thresholdsSeries?.scales.r.formatters[this.config.formatterName as string] ?? (d => d);
        const labelSelection = gaugeThresholdsLabelsGroup.selectAll(`text.${RadialGaugeThresholdLabelsPlugin.LABEL_CLASS}`)
            .data(GaugeRenderingUtils.generateThresholdData(data));
        labelSelection.exit().remove();
        labelSelection.enter()
            .append("text")
            .attr("class", RadialGaugeThresholdLabelsPlugin.LABEL_CLASS)
            .merge(labelSelection as any)
            .attr("transform", (d) => `translate(${labelGenerator.centroid(d)})`)
            .style("text-anchor", (d) => this.getTextAnchor(d.startAngle))
            .style("alignment-baseline", (d) => this.getAlignmentBaseline(d.startAngle))
            .text((d, i) => formatter(data[i].value));
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
            // used for right 120 degrees of chart
            return "start";
        }

        if (cosine < -0.5) {
            // used for left 120 degrees of chart
            return "end";
        }

        // used for top 60 degrees and bottom 60 degrees of chart
        return "middle";
    }

    private getAlignmentBaseline(angle: any): string {
        // pie charts start on the top, so we need to add Math.PI / 2 (90 degrees)
        const sine = Math.sin(Number(angle.toFixed(2)) + Math.PI / 2);
        if (sine > 0.5) {
            // used for top 120 degrees of chart
            return "text-after-edge";
        }

        if (sine < -0.5) {
            // used for bottom 120 degrees of chart
            return "text-before-edge";
        }

        // used for left 60 degrees and right 60 degrees of chart
        return "central";
    }

}
