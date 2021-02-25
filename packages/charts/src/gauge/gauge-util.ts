import { Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";

import { CHART_PALETTE_CS1 } from "../core/common/palette/palettes";
import { Renderer } from "../core/common/renderer";
import { Formatter, IRadialScales, Scales } from "../core/common/scales/types";
import { DataAccessor, IAccessors, IChartAssistSeries, IChartSeries, IDataSeries } from "../core/common/types";
import { GAUGE_LABEL_FORMATTER_NAME_DEFAULT } from "../core/plugins/gauge/constants";
import { HorizontalBarAccessors } from "../renderers/bar/accessors/horizontal-bar-accessors";
import { VerticalBarAccessors } from "../renderers/bar/accessors/vertical-bar-accessors";
import { BarRenderer } from "../renderers/bar/bar-renderer";
import { barScales } from "../renderers/bar/bar-scales";
import { LinearGaugeThresholdsRenderer } from "../renderers/bar/linear-gauge-thresholds-renderer";
import { RadialAccessors } from "../renderers/radial/accessors/radial-accessors";
import { radialGaugeRendererConfig } from "../renderers/radial/gauge/radial-gauge-renderer-config";
import { RadialGaugeThresholdsRenderer } from "../renderers/radial/gauge/radial-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";
import { radialScales } from "../renderers/radial/radial-scales";

import { GaugeMode } from "./constants";
import { IGaugeAttributes, IGaugeThreshold, IGaugeThresholdMarker, IGaugeTools } from "./types";

/**
 * @ignore
 * Convenience service to simplify gauge creation
 */
@Injectable({
    providedIn: "root",
})
export class GaugeUtil {
    public static QUANTITY_SERIES_ID = "quantity";
    public static REMAINDER_SERIES_ID = "remainder";
    public static THRESHOLD_MARKERS_SERIES_ID = "threshold-markers";

    public static assembleSeriesSet(value: number,
                             max: number,
                             thresholds: IGaugeThreshold[],
                             mode: GaugeMode,
                             valueColorAccessor?: DataAccessor): IChartAssistSeries<IAccessors>[] {
        value = value ?? 0;
        max = max ?? 0;
        const { accessors, scales, mainRenderer, thresholdsRenderer } = GaugeUtil.getGaugeAttributes(mode);
        if (accessors.data) {
            accessors.data.color = valueColorAccessor || GaugeUtil.createDefaultValueColorAccessor(thresholds);
        }

        const chartAssistSeries: IChartAssistSeries<IAccessors>[] = [
            ...GaugeUtil.getGaugeData(value, max).map(s => ({
                ...s,
                accessors,
                scales,
                renderer: mainRenderer,
            })),
        ];

        chartAssistSeries.push(GaugeUtil.generateThresholdSeries(value, max, thresholds, accessors, scales, thresholdsRenderer));

        return chartAssistSeries;
    }

    public static updateSeriesSet(value: number,
                           max: number,
                           thresholds: IGaugeThreshold[],
                           seriesSet: IChartAssistSeries<IAccessors>[]): IChartAssistSeries<IAccessors>[] {
        const newValue = value ?? 0;
        const newMax = max ?? 0;
        const updatedSeriesSet = seriesSet.map(series => {
            if (series.id === GaugeUtil.QUANTITY_SERIES_ID) {
                return { ...series, data: [{ category: "gauge", value: newValue }] };
            }

            if (series.id === GaugeUtil.REMAINDER_SERIES_ID) {
                return { ...series, data: [{ category: "gauge", value: newMax - newValue }] };
            }

            // threshold level markers
            return { ...series, data: GaugeUtil.getThresholdMarkerPoints(thresholds, newValue, newMax) };
        });

        return updatedSeriesSet;
    }

    public static generateThresholdSeries(value: number,
                                   max: number,
                                   thresholds: IGaugeThreshold[],
                                   accessors: IAccessors,
                                   scales: IRadialScales | Scales,
                                   thresholdsRenderer: Renderer<IAccessors>): IChartAssistSeries<IAccessors> {
        return {
            id: GaugeUtil.THRESHOLD_MARKERS_SERIES_ID,
            data: GaugeUtil.getThresholdMarkerPoints(thresholds, value, max),
            accessors,
            scales,
            renderer: thresholdsRenderer,
            excludeFromArcCalculation: true,
            preprocess: false,
        };
    }

    public static setThresholdLabelFormatter(formatter: Formatter<string>,
                                      seriesSet: IChartAssistSeries<IAccessors>[],
                                      formatterName = GAUGE_LABEL_FORMATTER_NAME_DEFAULT): IChartAssistSeries<IAccessors>[] {
        const thresholdsSeries = seriesSet.find((series: IChartSeries<IAccessors<any>>) => series.renderer instanceof RadialGaugeThresholdsRenderer);
        if (thresholdsSeries) {
            thresholdsSeries.scales.r.formatters[formatterName] = formatter;
        }
        return seriesSet;
    }

    public static getGaugeAttributes(mode: GaugeMode): IGaugeAttributes {
        const t: IGaugeTools = GaugeUtil.getGaugeTools(mode);
        const result: IGaugeAttributes = {
            accessors: t.accessorFunction(),
            mainRenderer: t.mainRendererFunction(),
            thresholdsRenderer: t.thresholdsRendererFunction(),
            scales: t.scaleFunction(),
        };

        return result;
    }

    public static getGaugeTools(mode: GaugeMode): IGaugeTools {
        const barRendererFunction = () => {
            const renderer = new BarRenderer();
            renderer.config.padding = 0;
            renderer.config.strokeWidth = 0;
            renderer.config.enableMinBarThickness = false;
            return renderer;
        };

        const chartTools: Record<GaugeMode, IGaugeTools> = {
            [GaugeMode.Radial]: {
                mainRendererFunction: () => new RadialRenderer(radialGaugeRendererConfig()),
                thresholdsRendererFunction: () => new RadialGaugeThresholdsRenderer(),
                accessorFunction: () => new RadialAccessors(),
                scaleFunction: () => radialScales(),
            },
            [GaugeMode.Horizontal]: {
                mainRendererFunction: barRendererFunction,
                thresholdsRendererFunction: () => new LinearGaugeThresholdsRenderer(),
                accessorFunction: () => new HorizontalBarAccessors(),
                scaleFunction: () => barScales({ horizontal: true }),
            },
            [GaugeMode.Vertical]: {
                mainRendererFunction: barRendererFunction,
                thresholdsRendererFunction: () => new LinearGaugeThresholdsRenderer(),
                accessorFunction: () => new VerticalBarAccessors(),
                scaleFunction: () => barScales(),
            },
        };

        return chartTools[mode];
    }

    public static createDefaultValueColorAccessor(thresholds: IGaugeThreshold[]) {
        // assigning to variable to prevent "Lambda not supported" error
        const valueColorAccessor = (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            if (dataSeries.id === GaugeUtil.REMAINDER_SERIES_ID) {
                return "var(--nui-color-semantic-unknown-bg-hover)";
            } else {
                if (!isUndefined(thresholds[1]?.value) && thresholds[1].value <= data.value) {
                    return "var(--nui-color-semantic-critical)";
                }
                if (!isUndefined(thresholds[0]?.value) && thresholds[0].value <= data.value) {
                    return "var(--nui-color-semantic-warning)";
                }
                return CHART_PALETTE_CS1[0];
            }
        };

        return valueColorAccessor;
    }

    public static getGaugeData(value: number, max: number) {
        return [
            // category property is used for unifying the linear-style gauge visualization into a single bar stack
            { id: GaugeUtil.QUANTITY_SERIES_ID, data: [{ category: "gauge", value }] },
            { id: GaugeUtil.REMAINDER_SERIES_ID, data: [{ category: "gauge", value: max - value }] },
        ];
    }

    public static getThresholdMarkerPoints(thresholds: IGaugeThreshold[], value: number, max: number): IGaugeThresholdMarker[] {
        const markerValues = thresholds.map(threshold => ({
            category: "gauge",
            hit: threshold.value <= value,
            value: threshold.value,
        }));

        return [...markerValues, { category: "gauge", value: max }];
    }
}
