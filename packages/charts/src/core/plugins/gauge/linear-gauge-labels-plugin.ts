import { Arc, arc, DefaultArcObject } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BarRenderer } from "../../../renderers/bar/bar-renderer";

import { DATA_POINT_NOT_FOUND, INTERACTION_DATA_POINTS_EVENT, MOUSE_ACTIVE_EVENT, STANDARD_RENDER_LAYERS } from "../../../constants";
import { LinearGaugeThresholdsRenderer } from "../../../renderers/bar/linear-gauge-thresholds-renderer";
import { RenderLayerName } from "../../../renderers/types";
import { ChartPlugin } from "../../common/chart-plugin";
import { D3Selection, IAccessors, IChartEvent, IChartSeries } from "../../common/types";
import { IAllAround } from "../../grid/types";

import { GAUGE_LABELS_CONTAINER_CLASS, GAUGE_LABEL_FORMATTER_NAME_DEFAULT, GAUGE_THRESHOLD_LABEL_CLASS } from "./constants";
import cloneDeep from "lodash/cloneDeep";

/**
 * @ignore
 * Configuration for the LinearGaugeLabelsPlugin
 */
export interface ILinearGaugeLabelsPluginConfig {
    gridMargin?: IAllAround<number>;
    labelPadding?: number;
    formatterName?: string;
    enableThresholdLabels?: boolean;

    // TODO: NUI-5815
    // enableIntervalLabels?: boolean;
}

/**
 * @ignore
 * A chart plugin that handles the rendering of labels for a donut gauge
 */
export class LinearGaugeLabelsPlugin extends ChartPlugin {
    public static readonly MARGIN_DEFAULT = 25;

    /** The default plugin configuration */
    public DEFAULT_CONFIG: ILinearGaugeLabelsPluginConfig = {
        gridMargin: {
            top: 0,
            right: 0,
            bottom: LinearGaugeLabelsPlugin.MARGIN_DEFAULT,
            left: 0,
        },
        labelPadding: 5,
        formatterName: GAUGE_LABEL_FORMATTER_NAME_DEFAULT,
        enableThresholdLabels: true,
    };

    private destroy$ = new Subject();
    private lasagnaLayer: D3Selection<SVGElement>;

    constructor(public config: ILinearGaugeLabelsPluginConfig = {}) {
        super();
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    public initialize(): void {
        this.lasagnaLayer = this.chart.getGrid().getLasagna().addLayer({
            name: GAUGE_LABELS_CONTAINER_CLASS,
            order: STANDARD_RENDER_LAYERS[RenderLayerName.data].order,
            clipped: false,
        });

        const gridConfig = this.chart.getGrid().config();
        gridConfig.dimension.margin = this.config.gridMargin as IAllAround<number>;

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
        const quantitySeries = this.chart.getDataManager().chartSeriesSet.find((series: IChartSeries<IAccessors<any>>) => series.id === "quantity");
        const thresholdSeries = this.chart.getDataManager().chartSeriesSet.find((series: IChartSeries<IAccessors<any>>) => series.id === "threshold-markers");
        const renderer = (quantitySeries?.renderer as BarRenderer);
        const accessors = thresholdSeries?.accessors;

        const data = cloneDeep(thresholdSeries?.data);
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

        const formatter = thresholdSeries?.scales.x.formatters[this.config.formatterName as string] ?? (d => d);
        const labelSelection = gaugeThresholdsLabelsGroup.selectAll(`text.${GAUGE_THRESHOLD_LABEL_CLASS}`).data(data);
        const xTranslate = (d: any, i: number) => thresholdSeries?.scales.x.convert(accessors?.data?.endX?.(d, i, thresholdSeries.data, thresholdSeries));
        const yTranslation = this.chart.getGrid().config().dimension.height() + 5;
        labelSelection.exit().remove();
        labelSelection.enter()
            .append("text")
            .attr("class", GAUGE_THRESHOLD_LABEL_CLASS)
            .merge(labelSelection as any)
            .attr("transform", (d, i) => `translate(${xTranslate(d, i)}, ${yTranslation})`)
            .attr("title", (d, i) => formatter(data[i].value))
            .style("text-anchor", (d) => "middle")
            .style("dominant-baseline", (d) => "hanging")
            .text((d, i) => formatter(data[i].value));
    }

}
