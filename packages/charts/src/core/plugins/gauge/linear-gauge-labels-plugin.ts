import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MOUSE_ACTIVE_EVENT, STANDARD_RENDER_LAYERS } from "../../../constants";
import { RenderLayerName } from "../../../renderers/types";
import { ChartPlugin } from "../../common/chart-plugin";
import { D3Selection, IAccessors, IChartEvent, IChartSeries, IDataSeries } from "../../common/types";

import { GAUGE_LABELS_CONTAINER_CLASS, GAUGE_LABEL_FORMATTER_NAME_DEFAULT, GAUGE_THRESHOLD_LABEL_CLASS } from "./constants";
import cloneDeep from "lodash/cloneDeep";
import { HorizontalBarAccessors } from "../../../renderers/bar/accessors/horizontal-bar-accessors";
import { GaugeUtil } from "../../../gauge/gauge-util";
import { IGaugeLabelsPluginConfig } from "./types";

/**
 * @ignore
 * A chart plugin that handles the rendering of labels for a donut gauge
 */
export class LinearGaugeLabelsPlugin extends ChartPlugin {
    /** The default plugin configuration */
    public DEFAULT_CONFIG: IGaugeLabelsPluginConfig = {
        clearance: {
            top: 20,
            right: 25,
            bottom: 20,
            left: 25,
        },
        autoClearance: true,
        padding: 5,
        formatterName: GAUGE_LABEL_FORMATTER_NAME_DEFAULT,
        enableThresholdLabels: true,
        flipLabels: false,
    };

    private destroy$ = new Subject();
    private lasagnaLayer: D3Selection<SVGElement>;
    private isHorizontal = true;
    private thresholdSeries: IChartSeries<IAccessors<any>> | undefined;

    constructor(public config: IGaugeLabelsPluginConfig = {}) {
        super();
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    public initialize(): void {
        this.lasagnaLayer = this.chart.getGrid().getLasagna().addLayer({
            name: GAUGE_LABELS_CONTAINER_CLASS,
            order: STANDARD_RENDER_LAYERS[RenderLayerName.data].order,
            clipped: false,
        });

        this.chart.getEventBus().getStream(MOUSE_ACTIVE_EVENT as string).pipe(
            takeUntil(this.destroy$)
        ).subscribe((event: IChartEvent) => {
            const gaugeThresholdLabelsGroup = this.lasagnaLayer.select(`.${GAUGE_LABELS_CONTAINER_CLASS}`);
            if (!gaugeThresholdLabelsGroup.empty()) {
                gaugeThresholdLabelsGroup.style("opacity", event.data ? 1 : 0);
            }
        });
    }

    public updateDimensions() {
        if (this.config.enableThresholdLabels) {
            this.thresholdSeries = this.chart.getDataManager().chartSeriesSet.find(
                (series: IChartSeries<IAccessors<any>>) => series.id === GaugeUtil.THRESHOLD_MARKERS_SERIES_ID
            );
            this.isHorizontal = this.thresholdSeries?.accessors instanceof HorizontalBarAccessors;
            this.adjustGridMargin();
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
        const data = cloneDeep(this.thresholdSeries?.data);
        if (isUndefined(data)) {
            throw new Error("Gauge threshold series data is undefined");
        }

        let gaugeThresholdsLabelsGroup = this.lasagnaLayer.select(`.${GAUGE_LABELS_CONTAINER_CLASS}`);
        if (gaugeThresholdsLabelsGroup.empty()) {
            gaugeThresholdsLabelsGroup = this.lasagnaLayer.append("svg:g")
                .attr("class", GAUGE_LABELS_CONTAINER_CLASS)
                .style("opacity", 0);
        }

        // last value in the thresholds series is the max value of the gauge (needed by RadialGaugeThresholdsRenderer).
        // removing this value to avoid rendering a marker for it
        data.pop();

        const formatter = this.thresholdSeries?.scales[this.isHorizontal ? "x" : "y"].formatters[this.config.formatterName as string] ?? (d => d);
        const labelSelection = gaugeThresholdsLabelsGroup.selectAll(`text.${GAUGE_THRESHOLD_LABEL_CLASS}`).data(data);

        labelSelection.exit().remove();
        labelSelection.enter()
            .append("text")
            .attr("class", GAUGE_THRESHOLD_LABEL_CLASS)
            .merge(labelSelection as any)
            .attr("transform", (d, i) => `translate(${this.xTranslate(d, i)}, ${this.yTranslate(d, i)})`)
            .attr("title", (d, i) => formatter(data[i].value))
            .style("text-anchor", (d) => this.getTextAnchor())
            .style("dominant-baseline", (d) => this.getAlignmentBaseline())
            .text((d, i) => formatter(data[i].value));
    }

    private getLabelOffset() {
        let labelStart = 0;
        if (!this.config.flipLabels) {
            const gridDimensions = this.chart.getGrid().config().dimension;
            labelStart = this.isHorizontal ? gridDimensions.height() : gridDimensions.width()
        }
        let padding = this.config.padding as number;
        padding = this.config.flipLabels ? -(padding) : padding;
        return labelStart + padding;
    }

    private xTranslate = (d: any, i: number) => {
        if (this.isHorizontal) {
            const thresholdSeries = this.thresholdSeries as IDataSeries<IAccessors>;
            const value = this.thresholdSeries?.accessors?.data?.endX?.(d, i, thresholdSeries?.data as any[], thresholdSeries);
            return this.thresholdSeries?.scales.x.convert(value);
        }

        return this.getLabelOffset();
    };

    private yTranslate = (d: any, i: number) => {
        if (this.isHorizontal) {
            return this.getLabelOffset();
        }

        const value = this.thresholdSeries?.accessors?.data?.endY?.(d, i, this.thresholdSeries?.data as any[], this.thresholdSeries as IDataSeries<IAccessors>);
        return this.thresholdSeries?.scales.y.convert(value);
    }

    private getTextAnchor(): string {
        if (this.isHorizontal) {
            return "middle";
        }

        return this.config.flipLabels ? "end" : "start";
    }

    private getAlignmentBaseline(): string {
        if (this.isHorizontal) {
            return this.config.flipLabels ? "text-after-edge" : "hanging";
        }

        return "central";
    }

    private adjustGridMargin() {
        if (this.config.autoClearance) {
            const gridConfig = this.chart.getGrid().config();
            const marginToAdjust = this.getMarginToAdjust();
            gridConfig.dimension.margin[marginToAdjust] = this.config.clearance?.[marginToAdjust] as number;
        }
    }

    private getMarginToAdjust() {
        if (this.isHorizontal ) {
            return this.config.flipLabels ? "top" : "bottom";
        }

        return this.config.flipLabels ? "left" : "right";
    }
}
