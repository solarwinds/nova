import { Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";

import { CHART_PALETTE_CS1 } from "../core/common/palette/palettes";
import { Formatter } from "../core/common/scales/types";
import { IAccessors, IChartAssistSeries, IChartSeries, IDataSeries } from "../core/common/types";
import { GAUGE_LABEL_FORMATTER_NAME_DEFAULT } from "../core/plugins/gauge/constants";
import { HorizontalBarAccessors } from "../renderers/bar/accessors/horizontal-bar-accessors";
import { VerticalBarAccessors } from "../renderers/bar/accessors/vertical-bar-accessors";
import { BarRenderer } from "../renderers/bar/bar-renderer";
import { barScales } from "../renderers/bar/bar-scales";
import { LinearGaugeThresholdsRenderer } from "../renderers/bar/linear-gauge-thresholds-renderer";
import { RadialAccessors } from "../renderers/radial/accessors/radial-accessors";
import { donutGaugeRendererConfig } from "../renderers/radial/gauge/donut-gauge-renderer-config";
import { DonutGaugeThresholdsRenderer } from "../renderers/radial/gauge/donut-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";
import { radialScales } from "../renderers/radial/radial-scales";

import { GaugeMode } from "./constants";
import { IGaugeAttributes, IGaugeSeriesConfig, IGaugeThreshold, IGaugeTools } from "./types";

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

    public static assembleSeriesSet(seriesConfig: IGaugeSeriesConfig, mode: GaugeMode): IChartAssistSeries<IAccessors>[] {
        seriesConfig.value = seriesConfig.value ?? 0;
        seriesConfig.max = seriesConfig.max ?? 0;
        const gaugeAttributes = GaugeUtil.getGaugeAttributes(mode);
        const { accessors, scales, mainRenderer } = gaugeAttributes;
        if (accessors.data) {
            accessors.data.color = seriesConfig.valueColorAccessor || GaugeUtil.createDefaultValueColorAccessor(seriesConfig.thresholds);
        }

        const chartAssistSeries: IChartAssistSeries<IAccessors>[] = [
            ...GaugeUtil.getGaugeData(seriesConfig.value, seriesConfig.max).map(s => ({
                ...s,
                accessors,
                scales,
                renderer: mainRenderer,
            })),
        ];

        chartAssistSeries.push(
            GaugeUtil.generateThresholdSeries(seriesConfig, gaugeAttributes)
        );

        return chartAssistSeries;
    }

    public static updateSeriesSet(seriesSet: IChartAssistSeries<IAccessors>[], seriesConfig: IGaugeSeriesConfig): IChartAssistSeries<IAccessors>[] {
        seriesConfig.value = seriesConfig.value ?? 0;
        seriesConfig.max = seriesConfig.max ?? 0;
        const colorAccessor = seriesConfig.valueColorAccessor || GaugeUtil.createDefaultValueColorAccessor(seriesConfig.thresholds);
        const updatedSeriesSet = seriesSet.map((series: IChartAssistSeries<IAccessors<any>>) => {
            if (series.accessors.data) {
                series.accessors.data.color = colorAccessor;
            }

            if (series.id === GaugeUtil.QUANTITY_SERIES_ID) {
                return { ...series, data: [{ category: "gauge", value: seriesConfig.value }] };
            }

            if (series.id === GaugeUtil.REMAINDER_SERIES_ID) {
                return { ...series, data: [{ category: "gauge", value: seriesConfig.max - seriesConfig.value }] };
            }

            // threshold level markers
            return { ...series, data: GaugeUtil.generateThresholdData(seriesConfig) };
        });

        return updatedSeriesSet;
    }

    public static generateThresholdSeries(seriesConfig: IGaugeSeriesConfig, gaugeAttributes: IGaugeAttributes): IChartAssistSeries<IAccessors> {
        return {
            id: GaugeUtil.THRESHOLD_MARKERS_SERIES_ID,
            data: GaugeUtil.generateThresholdData(seriesConfig),
            accessors: gaugeAttributes.accessors,
            scales: gaugeAttributes.scales,
            renderer: gaugeAttributes.thresholdsRenderer,
            excludeFromArcCalculation: true,
            preprocess: false,
        };
    }

    public static setThresholdLabelFormatter(formatter: Formatter<string>,
                                             seriesSet: IChartAssistSeries<IAccessors>[],
                                             formatterName = GAUGE_LABEL_FORMATTER_NAME_DEFAULT): IChartAssistSeries<IAccessors>[] {
        const thresholdsSeries = seriesSet.find((series: IChartSeries<IAccessors<any>>) => series.renderer instanceof DonutGaugeThresholdsRenderer);
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
            [GaugeMode.Donut]: {
                mainRendererFunction: () => new RadialRenderer(donutGaugeRendererConfig()),
                thresholdsRendererFunction: () => new DonutGaugeThresholdsRenderer(),
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

    public static createDefaultValueColorAccessor(thresholds: number[]) {
        // assigning to variable to prevent "Lambda not supported" error
        const valueColorAccessor = (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            if (dataSeries.id === GaugeUtil.REMAINDER_SERIES_ID) {
                return "var(--nui-color-semantic-unknown-bg-hover)";
            } else {
                if (!isUndefined(thresholds[1]) && thresholds[1] <= data.value) {
                    return "var(--nui-color-semantic-critical)";
                }
                if (!isUndefined(thresholds[0]) && thresholds[0] <= data.value) {
                    return "var(--nui-color-semantic-warning)";
                }
                return CHART_PALETTE_CS1[0];
            }
        };

        return valueColorAccessor;
    }

    public static createReversedValueColorAccessor(thresholds: number[]) {
        // assigning to variable to prevent "Lambda not supported" error
        const valueColorAccessor = (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            if (dataSeries.id === GaugeUtil.REMAINDER_SERIES_ID) {
                return "var(--nui-color-semantic-unknown-bg-hover)";
            } else {
                if (!isUndefined(thresholds[1]) && thresholds[1] <= data.value) {
                    return CHART_PALETTE_CS1[0];
                }
                if (!isUndefined(thresholds[0]) && thresholds[0] <= data.value) {
                    return "var(--nui-color-semantic-warning)";
                }
                return "var(--nui-color-semantic-critical)";
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

    public static generateThresholdData(seriesConfig: IGaugeSeriesConfig): IGaugeThreshold[] {
        const markerValues = seriesConfig.thresholds.map(threshold => ({
            category: "gauge",
            hit: threshold <= seriesConfig.value,
            value: threshold,
        }));

        // tack the max value onto the end (used for donut arc calculation)
        return [...markerValues, { category: "gauge", value: seriesConfig.max }];
    }
}
