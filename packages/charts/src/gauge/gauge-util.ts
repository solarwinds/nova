import { Directive, Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";
import { LinearScale } from "../core/common/scales/linear-scale";

import { Formatter, IRadialScales, Scales } from "../core/common/scales/types";
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

import { GaugeMode, GAUGE_QUANTITY_SERIES_ID, GAUGE_REMAINDER_SERIES_ID, GAUGE_THRESHOLD_MARKERS_SERIES_ID, StandardGaugeColor } from "./constants";
import { IGaugeConfig, IGaugeThreshold } from "./types";
import { linearGaugeRendererConfig } from "../renderers/bar/linear-gauge-renderer-config";
import { Renderer } from "../core/common/renderer";

/**
 * @ignore
 * Attributes needed by a gauge
 */
 export interface IGaugeAttributes {
    /** Accessors for the gauge data and series */
    accessors: IAccessors;
    /** Scales for the gauge */
    scales: Scales;
    /** Renderer for the primary gauge visualization */
    mainRenderer: Renderer<IAccessors>;
    /** Renderer for the gauge threshold visualization */
    thresholdsRenderer: Renderer<IAccessors>;
}

/**
 * @ignore
 * Interface for an object that can be used to create the attributes needed by a gauge
 */
 export interface IGaugeTools {
    /** Function for creating accessors */
    accessorFunction: () => IAccessors;
    /** Function for creating scales */
    scaleFunction: () => Scales | IRadialScales;
    /** Function for creating a main renderer */
    mainRendererFunction: () => Renderer<IAccessors>;
    /** Function for creating a thresholds renderer */
    thresholdsRendererFunction: () => Renderer<IAccessors>;
}

/**
 * @ignore
 * Convenience utility to simplify gauge usage
 */
@Directive() // decorator required in Angular 11+
export class GaugeUtil {
    /** Value used for unifying the linear-style gauge visualization into a single bar stack */
    public static DATA_CATEGORY = "gauge";

    /**
     * Assembles a gauge series set with all of the standard requisite scales, renderers, and accessors needed for creating a gauge visualization
     *
     * @param gaugeConfig The configuration for the series
     * @param mode Horizontal, Vertical, or Donut mode
     *
     * @returns {IChartAssistSeries<IAccessors>[]} The assembled series set
     */
    public static assembleSeriesSet(gaugeConfig: IGaugeConfig, mode: GaugeMode): IChartAssistSeries<IAccessors>[] {
        gaugeConfig.value = gaugeConfig.value ?? 0;
        gaugeConfig.max = gaugeConfig.max ?? 0;
        const gaugeAttributes = GaugeUtil.getGaugeAttributes(gaugeConfig, mode);
        const { accessors, scales, mainRenderer } = gaugeAttributes;
        if (accessors.data) {
            accessors.data.color = gaugeConfig.valueColorAccessor || GaugeUtil.createDefaultColorAccessor(gaugeConfig.thresholds);
        }

        const chartAssistSeries: IChartAssistSeries<IAccessors>[] = [
            ...GaugeUtil.getGaugeData(gaugeConfig.value, gaugeConfig.max).map(s => ({
                ...s,
                accessors,
                scales,
                renderer: mainRenderer,
            })),
        ];

        chartAssistSeries.push(GaugeUtil.generateThresholdSeries(gaugeConfig, gaugeAttributes));

        return chartAssistSeries;
    }

    public static updateSeriesSet(seriesSet: IChartAssistSeries<IAccessors>[], gaugeConfig: IGaugeConfig): IChartAssistSeries<IAccessors>[] {
        gaugeConfig.value = gaugeConfig.value ?? 0;
        gaugeConfig.max = gaugeConfig.max ?? 0;
        const colorAccessor = gaugeConfig.valueColorAccessor || GaugeUtil.createDefaultColorAccessor(gaugeConfig.thresholds);
        const updatedSeriesSet = seriesSet.map((series: IChartAssistSeries<IAccessors<any>>) => {
            if (series.accessors.data) {
                series.accessors.data.color = colorAccessor;
            }

            if (series.id === GAUGE_QUANTITY_SERIES_ID) {
                return { ...series, data: [{ category: GaugeUtil.DATA_CATEGORY, value: gaugeConfig.value }] };
            }

            if (series.id === GAUGE_REMAINDER_SERIES_ID) {
                return { ...series, data: [{ category: GaugeUtil.DATA_CATEGORY, value: gaugeConfig.max - gaugeConfig.value }] };
            }

            // series for the threshold level markers
            return { ...series, data: GaugeUtil.generateThresholdData(gaugeConfig) };
        });

        return updatedSeriesSet;
    }

    public static generateThresholdSeries(gaugeConfig: IGaugeConfig, gaugeAttributes: IGaugeAttributes): IChartAssistSeries<IAccessors> {
        return {
            id: GAUGE_THRESHOLD_MARKERS_SERIES_ID,
            data: GaugeUtil.generateThresholdData(gaugeConfig),
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
        const thresholdsSeries = seriesSet.find((series: IChartSeries<IAccessors<any>>) => series.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
        if (thresholdsSeries) {
            const linearScale = Object.values(thresholdsSeries.scales).find(scale => scale instanceof LinearScale);
            if (linearScale) {
                linearScale.formatters[formatterName] = formatter;
            }
        }
        return seriesSet;
    }

    public static getGaugeAttributes(gaugeConfig: IGaugeConfig, mode: GaugeMode): IGaugeAttributes {
        const t: IGaugeTools = GaugeUtil.getGaugeTools(gaugeConfig, mode);
        const result: IGaugeAttributes = {
            accessors: t.accessorFunction(),
            mainRenderer: t.mainRendererFunction(),
            thresholdsRenderer: t.thresholdsRendererFunction(),
            scales: t.scaleFunction(),
        };

        return result;
    }

    public static getGaugeTools(gaugeConfig: IGaugeConfig, mode: GaugeMode): IGaugeTools {
        const thresholdsConfig = { hideMarkers: gaugeConfig.hideThresholdMarkers };
        const chartTools: Record<GaugeMode, IGaugeTools> = {
            [GaugeMode.Donut]: {
                mainRendererFunction: () => new RadialRenderer(donutGaugeRendererConfig()),
                thresholdsRendererFunction: () => new DonutGaugeThresholdsRenderer(thresholdsConfig),
                accessorFunction: () => new RadialAccessors(),
                scaleFunction: () => radialScales(),
            },
            [GaugeMode.Horizontal]: {
                mainRendererFunction: () => new BarRenderer(linearGaugeRendererConfig()),
                thresholdsRendererFunction: () => new LinearGaugeThresholdsRenderer(thresholdsConfig),
                accessorFunction: () => new HorizontalBarAccessors(),
                scaleFunction: () => barScales({ horizontal: true }),
            },
            [GaugeMode.Vertical]: {
                mainRendererFunction: () => new BarRenderer(linearGaugeRendererConfig()),
                thresholdsRendererFunction: () => new LinearGaugeThresholdsRenderer(thresholdsConfig),
                accessorFunction: () => new VerticalBarAccessors(),
                scaleFunction: () => barScales(),
            },
        };

        return chartTools[mode];
    }

    public static createDefaultColorAccessor(thresholds: number[]) {
        // assigning to variable to prevent "Lambda not supported" error
        const valueColorAccessor = (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            if (dataSeries.id === GAUGE_REMAINDER_SERIES_ID) {
                return StandardGaugeColor.Remainder;
            } else {
                if (!isUndefined(thresholds[1]) && thresholds[1] <= data.value) {
                    return StandardGaugeColor.Critical;
                }
                if (!isUndefined(thresholds[0]) && thresholds[0] <= data.value) {
                    return StandardGaugeColor.Warning;
                }
                return StandardGaugeColor.Ok;
            }
        };

        return valueColorAccessor;
    }

    public static createReversedColorAccessor(thresholds: number[]) {
        // assigning to variable to prevent "Lambda not supported" error
        const valueColorAccessor = (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            if (dataSeries.id === GAUGE_REMAINDER_SERIES_ID) {
                return StandardGaugeColor.Remainder;
            } else {
                if (!isUndefined(thresholds[1]) && thresholds[1] <= data.value) {
                    return StandardGaugeColor.Ok;
                }
                if (!isUndefined(thresholds[0]) && thresholds[0] <= data.value) {
                    return StandardGaugeColor.Warning;
                }
                return StandardGaugeColor.Critical;
            }
        };

        return valueColorAccessor;
    }

    public static getGaugeData(value: number, max: number) {
        return [
            // category property is used for unifying the linear-style gauge visualization into a single bar stack
            { id: GAUGE_QUANTITY_SERIES_ID, data: [{ category: GaugeUtil.DATA_CATEGORY, value }] },
            { id: GAUGE_REMAINDER_SERIES_ID, data: [{ category: GaugeUtil.DATA_CATEGORY, value: max - value }] },
        ];
    }

    public static generateThresholdData(gaugeConfig: IGaugeConfig): IGaugeThreshold[] {
        const markerValues = gaugeConfig.thresholds.map(threshold => ({
            category: GaugeUtil.DATA_CATEGORY,
            value: threshold,
            hit: threshold <= gaugeConfig.value,
        }));

        // tack the max value onto the end (used for donut arc calculation)
        return [...markerValues, { category: GaugeUtil.DATA_CATEGORY, value: gaugeConfig.max, hit: false }];
    }
}
