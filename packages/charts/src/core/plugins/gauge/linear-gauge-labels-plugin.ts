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
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MOUSE_ACTIVE_EVENT, STANDARD_RENDER_LAYERS } from "../../../constants";
import { GAUGE_THRESHOLD_MARKERS_SERIES_ID } from "../../../gauge/constants";
import { RenderLayerName } from "../../../renderers/types";
import { ChartPlugin } from "../../common/chart-plugin";
import { LinearScale } from "../../common/scales/linear-scale";
import {
    D3Selection,
    IAccessors,
    IChartEvent,
    IChartSeries,
    IDataSeries,
} from "../../common/types";
import {
    GAUGE_LABELS_CONTAINER_CLASS,
    GAUGE_LABEL_FORMATTER_NAME_DEFAULT,
    GAUGE_THRESHOLD_LABEL_CLASS,
} from "./constants";
import { IGaugeLabelsPluginConfig } from "./types";

/**
 * A chart plugin that handles the rendering of labels for a donut gauge
 */
export class LinearGaugeLabelsPlugin extends ChartPlugin {
    /** The default plugin configuration */
    public DEFAULT_CONFIG: IGaugeLabelsPluginConfig = {
        padding: 5,
        formatterName: GAUGE_LABEL_FORMATTER_NAME_DEFAULT,
        disableThresholdLabels: false,
        flippedLabels: false,
    };

    private destroy$ = new Subject();
    private lasagnaLayer: D3Selection<SVGElement>;
    private isHorizontal = true;
    private thresholdsSeries: IChartSeries<IAccessors<any>> | undefined;

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
            .getStream(MOUSE_ACTIVE_EVENT as string)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                const gaugeThresholdLabelsGroup = this.lasagnaLayer.select(
                    `.${GAUGE_LABELS_CONTAINER_CLASS}`
                );
                if (!gaugeThresholdLabelsGroup.empty()) {
                    gaugeThresholdLabelsGroup.style(
                        "opacity",
                        event.data ? 1 : 0
                    );
                }
            });
    }

    public update(): void {
        this.updateData();
        this.drawThresholdLabels();
    }

    public updateDimensions(): void {
        this.updateData();
        this.drawThresholdLabels();
    }

    public destroy(): void {
        if (this.destroy$) {
            this.destroy$.next();
            this.destroy$.complete();
        }
    }

    private updateData() {
        this.thresholdsSeries = this.chart
            .getDataManager()
            .chartSeriesSet.find(
                (series: IChartSeries<IAccessors<any>>) =>
                    series.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
            );
        this.isHorizontal =
            this.thresholdsSeries?.scales.x instanceof LinearScale;
    }

    private drawThresholdLabels() {
        if (isUndefined(this.thresholdsSeries)) {
            console.warn(
                "Threshold series is undefined. As a result, threshold labels for the linear gauge will not be rendered."
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

        const data = cloneDeep(
            this.config.disableThresholdLabels
                ? []
                : this.thresholdsSeries?.data
        );
        if (isUndefined(data)) {
            throw new Error("Gauge threshold series data is undefined");
        }

        // last value in the thresholds series is the max value of the gauge (needed by RadialGaugeThresholdsRenderer).
        // removing this value to avoid rendering a label for it
        data.pop();

        const formatter =
            this.thresholdsSeries?.scales[this.isHorizontal ? "x" : "y"]
                .formatters[this.config.formatterName as string] ?? ((d) => d);
        const labelSelection = gaugeThresholdsLabelsGroup
            .selectAll(`text.${GAUGE_THRESHOLD_LABEL_CLASS}`)
            .data(data);

        labelSelection.exit().remove();
        labelSelection
            .enter()
            .append("text")
            .attr("class", GAUGE_THRESHOLD_LABEL_CLASS)
            .merge(labelSelection as any)
            .attr(
                "transform",
                (d, i) =>
                    `translate(${this.xTranslate(d, i)}, ${this.yTranslate(
                        d,
                        i
                    )})`
            )
            .attr("title", (d, i) => formatter(data[i].value))
            .style("text-anchor", (d) => this.getTextAnchor())
            .style("dominant-baseline", (d) => this.getAlignmentBaseline())
            .text((d, i) => formatter(data[i].value));
    }

    private xTranslate = (d: any, i: number) => {
        if (this.isHorizontal) {
            const thresholdsSeries = this
                .thresholdsSeries as IDataSeries<IAccessors>;
            const value = this.thresholdsSeries?.accessors?.data?.value?.(
                d,
                i,
                thresholdsSeries?.data as any[],
                thresholdsSeries
            );
            return this.thresholdsSeries?.scales.x.convert(value);
        }

        return this.getLabelOffset();
    };

    private yTranslate = (d: any, i: number) => {
        if (this.isHorizontal) {
            return this.getLabelOffset();
        }

        const thresholdsSeries = this
            .thresholdsSeries as IDataSeries<IAccessors>;
        const value = this.thresholdsSeries?.accessors?.data?.value?.(
            d,
            i,
            thresholdsSeries?.data as any[],
            thresholdsSeries
        );
        return this.thresholdsSeries?.scales.y.convert(value);
    };

    private getLabelOffset() {
        let labelStart = 0;
        if (!this.config.flippedLabels) {
            const gridDimensions = this.chart.getGrid().config().dimension;
            labelStart = this.isHorizontal
                ? gridDimensions.height()
                : gridDimensions.width();
        }
        let padding = this.config.padding as number;
        padding = this.config.flippedLabels ? -padding : padding;
        return labelStart + padding;
    }

    private getTextAnchor(): string {
        if (this.isHorizontal) {
            return "middle";
        }

        return this.config.flippedLabels ? "end" : "start";
    }

    private getAlignmentBaseline(): string {
        if (this.isHorizontal) {
            return this.config.flippedLabels ? "text-after-edge" : "hanging";
        }

        return "central";
    }
}
