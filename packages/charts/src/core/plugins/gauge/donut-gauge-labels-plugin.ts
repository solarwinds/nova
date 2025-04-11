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
import { takeUntil } from "rxjs/operators";

import {
    GAUGE_LABELS_CONTAINER_CLASS,
    GAUGE_LABEL_FORMATTER_NAME_DEFAULT,
    GAUGE_THRESHOLD_LABEL_CLASS,
} from "./constants";
import { IGaugeLabelsPluginConfig } from "./types";
import {
    DATA_POINT_NOT_FOUND,
    INTERACTION_DATA_POINTS_EVENT,
    STANDARD_RENDER_LAYERS,
} from "../../../constants";
import { DonutGaugeRenderingUtil } from "../../../renderers/radial/gauge/donut-gauge-rendering-util";
import { DonutGaugeThresholdsRenderer } from "../../../renderers/radial/gauge/donut-gauge-thresholds-renderer";
import { RenderLayerName } from "../../../renderers/types";
import { ChartPlugin } from "../../common/chart-plugin";
import {
    D3Selection,
    IAccessors,
    IChartEvent,
    IChartSeries,
} from "../../common/types";

/**
 * A chart plugin that handles the rendering of labels for a donut gauge
 */
export class DonutGaugeLabelsPlugin extends ChartPlugin {
    public static readonly MARGIN_DEFAULT = 25;

    /** The default plugin configuration */
    public DEFAULT_CONFIG: IGaugeLabelsPluginConfig = {
        padding: 5,
        formatterName: GAUGE_LABEL_FORMATTER_NAME_DEFAULT,
        disableThresholdLabels: false,
    };

    private readonly destroy$ = new Subject<void>();
    private lasagnaLayer: D3Selection<SVGElement>;

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

        this.chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT as string)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                const gaugeThresholdLabelsGroup = this.lasagnaLayer.select(
                    `.${GAUGE_LABELS_CONTAINER_CLASS}`
                );
                if (!gaugeThresholdLabelsGroup.empty()) {
                    const dataPoints = event.data.dataPoints;
                    const labelOpacity = Object.keys(dataPoints).find(
                        (key, index) =>
                            dataPoints[key].index === DATA_POINT_NOT_FOUND
                    )
                        ? 0
                        : 1;
                    gaugeThresholdLabelsGroup.style("opacity", labelOpacity);
                }
            });
    }

    public update(): void {
        this.drawThresholdLabels();
    }

    public updateDimensions(): void {
        this.drawThresholdLabels();
    }

    public destroy(): void {
        if (this.destroy$) {
            this.destroy$.next();
            this.destroy$.complete();
        }
    }

    private drawThresholdLabels() {
        const thresholdsSeries = this.chart
            .getDataManager()
            .chartSeriesSet.find(
                (series: IChartSeries<IAccessors<any>>) =>
                    series.renderer instanceof DonutGaugeThresholdsRenderer
            );

        if (isUndefined(thresholdsSeries)) {
            console.warn(
                "Threshold series is undefined. As a result, threshold labels for the donut gauge will not be rendered."
            );
            return;
        }

        let gaugeThresholdsLabelsGroup = this.lasagnaLayer.select(
            `.${GAUGE_LABELS_CONTAINER_CLASS}`
        );
        if (gaugeThresholdsLabelsGroup.empty()) {
            gaugeThresholdsLabelsGroup = this.lasagnaLayer
                .append("svg:g")
                .attr("class", GAUGE_LABELS_CONTAINER_CLASS)
                .style("opacity", 0);
        }

        const renderer =
            thresholdsSeries?.renderer as DonutGaugeThresholdsRenderer;
        const labelRadius =
            renderer?.getOuterRadius(
                thresholdsSeries?.scales.r.range() ?? [0, 0],
                0
            ) + (this.config.padding as number);
        if (isUndefined(labelRadius)) {
            throw new Error("Radius is undefined");
        }

        const labelGenerator: Arc<any, DefaultArcObject> = arc()
            .outerRadius(labelRadius)
            .innerRadius(labelRadius);

        const formatter =
            thresholdsSeries?.scales.r.formatters[
                this.config.formatterName as string
            ] ?? ((d) => d);

        const data = cloneDeep(
            this.config.disableThresholdLabels ? [] : thresholdsSeries?.data
        );
        if (isUndefined(data)) {
            throw new Error("Gauge threshold series data is undefined");
        }

        // ensure the data is sorted in ascending order by value since we're using it to calculate circle arcs
        data.sort((a, b) => a.value - b.value);

        const labelSelection = gaugeThresholdsLabelsGroup
            .selectAll(`text.${GAUGE_THRESHOLD_LABEL_CLASS}`)
            .data(DonutGaugeRenderingUtil.generateThresholdArcData(data));
        labelSelection.exit().remove();
        labelSelection
            .enter()
            .append("text")
            .attr("class", GAUGE_THRESHOLD_LABEL_CLASS)
            .merge(labelSelection as any)
            .attr(
                "transform",
                (d) => `translate(${labelGenerator.centroid(d)})`
            )
            .attr("title", (d, i) => formatter(data[i].value))
            .style("text-anchor", (d) => this.getTextAnchor(d.startAngle))
            .style("dominant-baseline", (d) =>
                this.getAlignmentBaseline(d.startAngle)
            )
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
