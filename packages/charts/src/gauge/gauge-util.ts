import { LinearScale } from "../core/common/scales/linear-scale";

import { Formatter, IRadialScales, Scales } from "../core/common/scales/types";
import { DataAccessor, IAccessors, IChartAssistSeries, IChartSeries, IDataSeries, IGaugeThresholdsRendererConfig } from "../core/common/types";
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

import {
    GaugeMode,
    GAUGE_QUANTITY_SERIES_ID,
    GAUGE_REMAINDER_SERIES_ID,
    GAUGE_THRESHOLD_MARKERS_SERIES_ID,
    StandardGaugeColor,
    StandardGaugeThresholdId,
} from "./constants";
import { IGaugeConfig, IGaugeThreshold, IGaugeThresholdConfig, IGaugeThresholdConfigs, IGaugeThresholdsData } from "./types";
import { linearGaugeRendererConfig } from "../renderers/bar/linear-gauge-renderer-config";
import { Renderer } from "../core/common/renderer";
import isUndefined from "lodash/isUndefined";

/**
 * @ignore
 * Attributes needed by a gauge
 */
export interface IGaugeRenderingAttributes {
    /** Accessors for the gauge quantity segment */
    quantityAccessors: IAccessors;
    /** Accessors for the gauge remainder segment */
    remainderAccessors: IAccessors;
    /** Scales for the gauge */
    scales: Scales;
    /** Renderer for the primary gauge visualization */
    mainRenderer: Renderer<IAccessors>;
    /** Renderer for the gauge threshold visualization */
    thresholdsRenderer: Renderer<IAccessors>;
}

/**
 * @ignore
 * Interface for an object that can be used to create the rendering attributes needed by a gauge
 */
export interface IGaugeRenderingTools {
    /** Function for creating quantity accessors */
    quantityAccessorFunction: () => IAccessors;
    /** Function for creating remainder accessors */
    remainderAccessorFunction: () => IAccessors;
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
export class GaugeUtil {
    /** Value used for unifying the linear-style gauge visualization into a single bar stack */
    public static readonly DATA_CATEGORY = "gauge";

    /**
     * Assembles a gauge series set with all of the standard scales, renderers, accessors, etc. needed for creating a gauge visualization
     *
     * @param gaugeConfig The configuration for the gauge
     * @param mode The mode of the gauge (Donut, Horizontal, or Vertical)
     *
     * @returns {IChartAssistSeries<IAccessors>[]} The assembled series set
     */
    public static assembleSeriesSet(gaugeConfig: IGaugeConfig, mode: GaugeMode): IChartAssistSeries<IAccessors>[] {
        gaugeConfig.value = gaugeConfig.value ?? 0;
        gaugeConfig.max = gaugeConfig.max ?? 0;
        const clampedConfig = GaugeUtil.clampConfigToRange(gaugeConfig);
        const renderAttrs = GaugeUtil.generateRenderingAttributes(clampedConfig, mode);
        let thresholdsSeries: IChartAssistSeries<IAccessors<any>> | undefined;
        let seriesSet: IChartAssistSeries<IAccessors>[] = [];

        if (clampedConfig.thresholds) {
            thresholdsSeries = GaugeUtil.generateThresholdSeries(clampedConfig, renderAttrs);
            seriesSet.push(thresholdsSeries);
        }

        const quantityAndRemainderSeriesSet = GaugeUtil.generateQuantityAndRemainderSeriesSet(clampedConfig, renderAttrs, thresholdsSeries?.activeThreshold);

        seriesSet = [
            ...quantityAndRemainderSeriesSet,
            ...seriesSet,
        ] as IChartAssistSeries<IAccessors>[];

        return seriesSet;
    }

    /**
     * Updates the series set based on the provided configuration
     *
     * @param seriesSet The set of series to update
     * @param gaugeConfig The configuration for the gauge
     *
     * @returns {IChartAssistSeries<IAccessors>[]} The updated series set
     */
    public static updateSeriesSet(seriesSet: IChartAssistSeries<IAccessors>[], gaugeConfig: IGaugeConfig): IChartAssistSeries<IAccessors>[] {
        gaugeConfig.value = gaugeConfig.value ?? 0;
        gaugeConfig.max = gaugeConfig.max ?? 0;
        const clampedConfig = GaugeUtil.clampConfigToRange(gaugeConfig);
        const thresholdsData = GaugeUtil.generateThresholdsData(clampedConfig);

        const updatedSeriesSet = seriesSet.map((series: IChartAssistSeries<IAccessors<any>>) => {
            if (series.id === GAUGE_QUANTITY_SERIES_ID) {
                return {
                    ...series,
                    data: [{ category: GaugeUtil.DATA_CATEGORY, value: clampedConfig.value }],
                    activeThreshold: thresholdsData.activeThreshold,
                    defaultColor: clampedConfig.defaultQuantityColor || StandardGaugeColor.Ok,
                };
            }

            if (series.id === GAUGE_REMAINDER_SERIES_ID) {
                return { ...series, data: [{ category: GaugeUtil.DATA_CATEGORY, value: clampedConfig.max - clampedConfig.value }] };
            }

            if (series.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID) {
                (series.renderer.config as IGaugeThresholdsRendererConfig).enabled = !clampedConfig.disableThresholdMarkers;
                return { ...series, ...thresholdsData };
            }

            return series;
        });

        return updatedSeriesSet;
    }

    /**
     * Generates a set of chart series used for visualizing the gauge's quantity and remainder data
     *
     * @param gaugeConfig The configuration for the gauge
     * @param renderingAttributes The attributes needed to visualized the thresholds
     * @param activeThreshold The currently active threshold
     *
     * @returns {IChartAssistSeries<IAccessors<any>>[]} A set of chart series representing the quantity and remainder data
     */
    public static generateQuantityAndRemainderSeriesSet(
        gaugeConfig: IGaugeConfig,
        renderingAttributes: IGaugeRenderingAttributes,
        activeThreshold?: IGaugeThreshold
    ): IChartAssistSeries<IAccessors<any>>[] {
        return GaugeUtil.generateQuantityAndRemainderData(gaugeConfig).map((series: Partial<IDataSeries<IAccessors>>) => {
            const { quantityAccessors, remainderAccessors, scales, mainRenderer } = renderingAttributes;

            if (quantityAccessors.data) {
                quantityAccessors.data.color = gaugeConfig.quantityColorAccessor || GaugeUtil.createDefaultQuantityColorAccessor();
            }

            if (remainderAccessors.data) {
                remainderAccessors.data.color = gaugeConfig.remainderColorAccessor || (() => (StandardGaugeColor.Remainder));
            }

            if (series.id === GAUGE_QUANTITY_SERIES_ID) {
                series.activeThreshold = activeThreshold;
                series.defaultColor = gaugeConfig.defaultQuantityColor || StandardGaugeColor.Ok;
            }

            return {
                ...series,
                accessors: series.id === GAUGE_QUANTITY_SERIES_ID ? quantityAccessors : remainderAccessors,
                scales,
                renderer: mainRenderer,
            } as IChartAssistSeries<IAccessors<any>>;
        });
    }

    /**
     * Generates a series for visualizing the gauge's thresholds
     *
     * @param gaugeConfig The configuration for the gauge
     * @param renderingAttributes The attributes needed to visualized the thresholds
     *
     * @returns {IChartAssistSeries<IAccessors>} The threshold series
     */
    public static generateThresholdSeries(gaugeConfig: IGaugeConfig, renderingAttributes: IGaugeRenderingAttributes): IChartAssistSeries<IAccessors> {
        const { quantityAccessors, scales, thresholdsRenderer } = renderingAttributes;
        return {
            ...GaugeUtil.generateThresholdsData(gaugeConfig),
            accessors: quantityAccessors,
            scales,
            renderer: thresholdsRenderer,
            // instruct the radial preprocessor to ignore the threshold series when calculating the donut arcs
            excludeFromArcCalculation: true,
            // instruct the stacked and radial preprocessors that the threshold data doesn't need to be mutated
            preprocess: false,
        } as IChartAssistSeries<IAccessors>;
    }

    /**
     * Sets the formatter to use for the threshold labels
     *
     * @param formatter The formatter to use for the threshold labels
     * @param seriesSet The series set to apply the formatter to
     * @param formatterName Optional name for the formatter
     *
     * @returns {IChartAssistSeries<IAccessors>[]} The series set as modified to use the provided formatter
     */
    public static setThresholdLabelFormatter(
        formatter: Formatter<string>,
        seriesSet: IChartAssistSeries<IAccessors>[],
        formatterName = GAUGE_LABEL_FORMATTER_NAME_DEFAULT
    ): IChartAssistSeries<IAccessors>[] {
        const thresholdsSeries = seriesSet.find((series: IChartSeries<IAccessors<any>>) => series.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
        if (thresholdsSeries) {
            const linearScale = Object.values(thresholdsSeries.scales).find(scale => scale instanceof LinearScale);
            if (linearScale) {
                linearScale.formatters[formatterName] = formatter;
            }
        }
        return seriesSet;
    }

    /**
     * Generates the attributes required to instantiate a standard gauge in the specified mode
     *
     * @param gaugeConfig The configuration for the gauge
     * @param mode The mode of the gauge (Donut, Horizontal, or Vertical)
     *
     * @returns {IGaugeRenderingAttributes} The attributes required to instantiate a gauge
     */
    public static generateRenderingAttributes(gaugeConfig: IGaugeConfig, mode: GaugeMode): IGaugeRenderingAttributes {
        const renderingTools = GaugeUtil.generateRenderingTools(gaugeConfig, mode);
        const result: IGaugeRenderingAttributes = {
            quantityAccessors: renderingTools.quantityAccessorFunction(),
            remainderAccessors: renderingTools.remainderAccessorFunction(),
            mainRenderer: renderingTools.mainRendererFunction(),
            thresholdsRenderer: renderingTools.thresholdsRendererFunction(),
            scales: renderingTools.scaleFunction(),
        };

        return result;
    }

    /**
     * Generates rendering tools for standard gauge attributes
     *
     * @param gaugeConfig The configuration for the gauge
     * @param mode The mode of the gauge (Donut, Horizontal, or Vertical)
     *
     * @returns {IGaugeRenderingTools} The rendering tools for standard gauge attributes
     */
    public static generateRenderingTools(gaugeConfig: IGaugeConfig, mode: GaugeMode): IGaugeRenderingTools {
        const renderingTools: Record<GaugeMode, IGaugeRenderingTools> = {
            [GaugeMode.Donut]: {
                mainRendererFunction: () => new RadialRenderer(donutGaugeRendererConfig()),
                thresholdsRendererFunction: () => new DonutGaugeThresholdsRenderer({ enabled: !gaugeConfig.disableThresholdMarkers }),
                quantityAccessorFunction: () => new RadialAccessors(),
                remainderAccessorFunction: () => new RadialAccessors(),
                scaleFunction: () => radialScales(),
            },
            [GaugeMode.Horizontal]: {
                mainRendererFunction: () => new BarRenderer(linearGaugeRendererConfig()),
                thresholdsRendererFunction: () => new LinearGaugeThresholdsRenderer({ enabled: !gaugeConfig.disableThresholdMarkers }),
                quantityAccessorFunction: () => new HorizontalBarAccessors(),
                remainderAccessorFunction: () => new HorizontalBarAccessors(),
                scaleFunction: () => barScales({ horizontal: true }),
            },
            [GaugeMode.Vertical]: {
                mainRendererFunction: () => new BarRenderer(linearGaugeRendererConfig()),
                thresholdsRendererFunction: () => new LinearGaugeThresholdsRenderer({ enabled: !gaugeConfig.disableThresholdMarkers }),
                quantityAccessorFunction: () => new VerticalBarAccessors(),
                remainderAccessorFunction: () => new VerticalBarAccessors(),
                scaleFunction: () => barScales(),
            },
        }

        return renderingTools[mode];
    }

    /**
     * Convenience function for creating a standard gauge quantity color accessor
     *
     * @returns {DataAccessor} An accessor for determining the color to use for the quantity visualization
     */
    public static createDefaultQuantityColorAccessor(): DataAccessor {
        const colorAccessor: DataAccessor = (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) =>
            dataSeries.activeThreshold ? dataSeries.activeThreshold.color : dataSeries.defaultColor;

        return colorAccessor;
    }

    /**
     * Convenience function for creating a standard standard set of threshold configs. Includes configurations for warning and error thresholds.
     *
     * @param warningVal Value for the warning threshold
     * @param criticalVal Value for the critical threshold
     *
     * @returns {IGaugeThresholdConfigs} The threshold configs
     */
    public static createStandardThresholdConfigs(warningVal: number, criticalVal: number): IGaugeThresholdConfigs {
        return {
            [StandardGaugeThresholdId.Warning]: {
                id: StandardGaugeThresholdId.Warning,
                value: warningVal,
                enabled: true,
                color: StandardGaugeColor.Warning,
            },
            [StandardGaugeThresholdId.Critical]: {
                id: StandardGaugeThresholdId.Critical,
                value: criticalVal,
                enabled: true,
                color: StandardGaugeColor.Critical,
            },
        }
    }

    /**
     * Generates quantity and remainder data in the format needed by the gauge visualization
     *
     * @param gaugeConfig The configuration for the gauge
     *
     * @returns {Partial<IDataSeries<IAccessors>>[]} Array of partial IDataSeries objects including the 'id' and 'data' properties of the quantity and remainder
     * series needed by the gauge visualization
     */
    public static generateQuantityAndRemainderData(gaugeConfig: IGaugeConfig): Partial<IDataSeries<IAccessors>>[] {
        const clampedConfig = GaugeUtil.clampConfigToRange(gaugeConfig);

        return [
            // category property is used for unifying the linear-style gauge visualization into a single bar stack
            { id: GAUGE_QUANTITY_SERIES_ID, data: [{ category: GaugeUtil.DATA_CATEGORY, value: clampedConfig.value }] },
            { id: GAUGE_REMAINDER_SERIES_ID, data: [{ category: GaugeUtil.DATA_CATEGORY, value: clampedConfig.max - clampedConfig.value }] },
        ];
    }

    /**
     * Generates threshold data in the form needed by the gauge's thresholds visualization
     *
     * @param gaugeConfig The configuration for the gauge
     *
     * @returns {Partial<IDataSeries<IAccessors, IGaugeThreshold>>} A partial IDataSeries object including the 'id' and 'data' properties of the thresholds
     * series used for the the gauge's thresholds visualization
     */
    public static generateThresholdsData(gaugeConfig: IGaugeConfig): Partial<IDataSeries<IAccessors, IGaugeThreshold>> {
        if (!gaugeConfig.thresholds) {
            throw new Error("Thresholds are not defined in the gauge config. Unable to generate threshold data.")
        }

        const { thresholds, activeThreshold } = GaugeUtil.prepareThresholdsData(gaugeConfig);

        return {
            id: GAUGE_THRESHOLD_MARKERS_SERIES_ID,
            data: [
                ...thresholds,
                // tack the max value onto the end (this is used for donut arc calculation)
                {
                    id: "max",
                    enabled: true,
                    category: GaugeUtil.DATA_CATEGORY,
                    value: gaugeConfig.max,
                },
            ],
            activeThreshold,
        };
    }

    /**
     * Generates visualization-specific thresholds data based on the gauge's configuration
     *
     * @param gaugeConfig The gauge configuration
     *
     * @returns {IGaugeThresholdsData} Thresholds data modified for use by the gauge visualization
     */
    public static prepareThresholdsData(gaugeConfig: IGaugeConfig): IGaugeThresholdsData {
        const thresholds: IGaugeThreshold[] = Object.values(gaugeConfig.thresholds || [])
            .filter((threshold: IGaugeThresholdConfig) => threshold.enabled)
            .map((threshold: IGaugeThresholdConfig) => ({
                ...threshold,
                category: GaugeUtil.DATA_CATEGORY,
                // threshold values are exclusive when in reversed mode, inclusive otherwise
                hit: gaugeConfig.reversedThresholds ? threshold.value < gaugeConfig.value : threshold.value <= gaugeConfig.value,
            })).sort((a, b) => a.value - b.value);

        const activeThreshold: IGaugeThreshold | undefined = gaugeConfig.reversedThresholds ?
            thresholds?.find(threshold => !isUndefined(threshold.hit) && !threshold.hit) :
            thresholds?.slice().reverse().find(threshold => threshold.hit);

        return {
            thresholds,
            activeThreshold,
        }
    }

    private static clampConfigToRange(gaugeConfig: IGaugeConfig): IGaugeConfig {
        let value = gaugeConfig.value;
        if (gaugeConfig.value > gaugeConfig.max) {
            console.warn(`Configured gauge value ${gaugeConfig.value} is greater` +
                `than configured max ${gaugeConfig.max}. Clamping value to ${gaugeConfig.max}.`);
            value = gaugeConfig.max;
        }

        if (gaugeConfig.value < 0) {
            console.warn(`Configured gauge value ${gaugeConfig.value} is less than 0. Clamping value to 0.`);
            value = 0;
        }

        const thresholds = gaugeConfig.thresholds || {};
        Object.keys(thresholds || {}).forEach(thresholdId => {
            const threshold = thresholds[thresholdId];
            if (threshold) {
                if (threshold.value > gaugeConfig.max) {
                    console.warn(`Configured threshold value ${threshold.value} for threshold ${thresholdId} is greater` +
                        `than configured max ${gaugeConfig.max}. Clamping value to ${gaugeConfig.max}.`);
                    threshold.value = gaugeConfig.max;
                }

                if (threshold.value < 0) {
                    console.warn(`Configured threshold value ${threshold.value} is less than 0. Clamping value to 0.`);
                    threshold.value = 0;
                }
            }
        });

        return { ...gaugeConfig, thresholds, value };
    }
}
