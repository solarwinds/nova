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
 * Configuration for the RadialGaugeLabelsPlugin
 */
export interface IRadialGaugeLabelsPluginConfig {
    gridMargin?: IAllAround<number>;
    labelPadding?: number;
    formatterName?: string;
    enableThresholdLabels?: boolean;

    // TODO: coming soon
    // enableIntervalLabels?: boolean;
}

/**
 * @ignore
 * A chart plugin that handles the rendering of labels for radial gauge thresholds
 */
export class RadialGaugeLabelsPlugin extends ChartPlugin {
    public static readonly CONTAINER_CLASS = "gauge-labels";
    public static readonly THRESHOLD_LABEL_CLASS = "threshold-label";
    public static readonly FORMATTER_NAME_DEFAULT = "threshold-label";
    public static readonly MARGIN_DEFAULT = 25;

    /** The default plugin configuration */
    public DEFAULT_CONFIG: IRadialGaugeLabelsPluginConfig = {
        gridMargin: {
            top: RadialGaugeLabelsPlugin.MARGIN_DEFAULT,
            right: RadialGaugeLabelsPlugin.MARGIN_DEFAULT,
            bottom: RadialGaugeLabelsPlugin.MARGIN_DEFAULT,
            left: RadialGaugeLabelsPlugin.MARGIN_DEFAULT,
        },
        labelPadding: 5,
        formatterName: RadialGaugeLabelsPlugin.FORMATTER_NAME_DEFAULT,
        enableThresholdLabels: true,
    };

    private destroy$ = new Subject();
    private lasagnaLayer: D3Selection<SVGElement>;

    constructor(public config: IRadialGaugeLabelsPluginConfig = {}) {
        super();
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    public initialize(): void {
        this.lasagnaLayer = this.chart.getGrid().getLasagna().addLayer({
            name: RadialGaugeLabelsPlugin.CONTAINER_CLASS,
            order: STANDARD_RENDER_LAYERS[RenderLayerName.data].order,
            clipped: false,
        });

        const gridConfig = this.chart.getGrid().config();
        gridConfig.dimension.margin = this.config.gridMargin as IAllAround<number>;

        this.chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT as string).pipe(
            takeUntil(this.destroy$)
        ).subscribe((event: IChartEvent) => {
            const gaugeThresholdLabelsGroup = this.lasagnaLayer.select(`.${RadialGaugeLabelsPlugin.CONTAINER_CLASS}`);
            if (!gaugeThresholdLabelsGroup.empty()) {
                const dataPoints = event.data.dataPoints;
                const labelOpacity = Object.keys(dataPoints).find((key, index) => dataPoints[key].index === DATA_POINT_NOT_FOUND) ? 0 : 1;
                gaugeThresholdLabelsGroup.style("opacity", labelOpacity);
            }
        });
    }

    public updateDimensions() {
        if (this.config.enableThresholdLabels) {
            this.drawThresholdLabels();
        }
    }

    public destroy(): void {
        if (this.destroy$) {
            this.destroy$.next();
            this.destroy$.complete();
        }
    }

    private drawThresholdLabels() {
        const thresholdsSeries = this.chart.getDataManager().chartSeriesSet.find((series: IChartSeries<IAccessors<any>>) => series.renderer instanceof RadialGaugeThresholdsRenderer);
        const renderer = (thresholdsSeries?.renderer as RadialGaugeThresholdsRenderer);
        const labelRadius = renderer?.getOuterRadius(thresholdsSeries?.scales.r.range() ?? [0, 0], 0) + (this.config.labelPadding as number);
        if (isUndefined(labelRadius)) {
            throw new Error("Radius is undefined");
        }

        const data = thresholdsSeries?.data;
        if (isUndefined(data)) {
            throw new Error("Gauge threshold series data is undefined");
        }

        let gaugeThresholdsLabelsGroup = this.lasagnaLayer.select(`.${RadialGaugeLabelsPlugin.CONTAINER_CLASS}`);
        if (gaugeThresholdsLabelsGroup.empty()) {
            gaugeThresholdsLabelsGroup = this.lasagnaLayer.append("svg:g")
                .attr("class", RadialGaugeLabelsPlugin.CONTAINER_CLASS)
                .style("opacity", 0);
        }

        const labelGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(labelRadius)
            .innerRadius(labelRadius);

        const formatter = thresholdsSeries?.scales.r.formatters[this.config.formatterName as string] ?? (d => d);
        const labelSelection = gaugeThresholdsLabelsGroup.selectAll(`text.${RadialGaugeLabelsPlugin.THRESHOLD_LABEL_CLASS}`)
            .data(GaugeRenderingUtils.generateRadialThresholdData(data));
        labelSelection.exit().remove();
        labelSelection.enter()
            .append("text")
            .attr("class", RadialGaugeLabelsPlugin.THRESHOLD_LABEL_CLASS)
            .merge(labelSelection as any)
            .attr("transform", (d) => `translate(${labelGenerator.centroid(d)})`)
            .attr("title", (d, i) => formatter(data[i].value))
            .style("text-anchor", (d) => this.getTextAnchor(d.startAngle))
            .style("alignment-baseline", (d) => this.getAlignmentBaseline(d.startAngle))
            .text((d, i) => formatter(data[i].value));
    }

    private getTextAnchor(angle: any): string {
        // pie charts start on the top, so we need to subtract Math.PI / 2 (90 degrees)
        const cosine = Math.cos(angle - Math.PI / 2);
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
        const sine = Math.sin(angle + Math.PI / 2);
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
