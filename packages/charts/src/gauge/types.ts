import { DataAccessor } from "../core/common/types";

/**
 * @ignore
 * Configuration for a gauge series
*/
export interface IGaugeConfig {
    /** The value of the gauge */
    value: number;
    /** The max value of the gauge */
    max: number;
    /** The color to display for the quantity when no threshold is active */
    defaultQuantityColor?: string;
    /** An optional array of the gauge's threshold values */
    thresholds?: IGaugeThresholdConfigs;
    /** Set to true to disable the threshold markers */
    disableThresholdMarkers?: boolean;
    /** Boolean indicating whether the direction of the thresholds should be reversed */
    reversedThresholds?: boolean;
    /** Optional accessor for customizing the color to display for the quantity segment as each threshold is hit */
    quantityColorAccessor?: DataAccessor;
    /** Optional accessor for customizing the color to display for the remainder segment */
    remainderColorAccessor?: DataAccessor;
}

/**
 * @ignore
 * Map of threshold IDs to IGaugeThresholdConfig objects
 */
export type IGaugeThresholdConfigs = Record<string, IGaugeThresholdConfig>;

/**
 * @ignore
 * Configuration for a gauge threshold
 */
export interface IGaugeThresholdConfig {
    /** The ID of the threshold */
    id: string;
    /** The value of the threshold */
    value: number;
    /** Boolean indicating whether the threshold is enabled */
    enabled: boolean;
    /** String indicating the display color of the threshold */
    color?: string;
}

/**
 * @ignore
 * Definition for a gauge threshold datum
*/
export interface IGaugeThreshold extends IGaugeThresholdConfig {
    /** Boolean indicating whether the threshold is hit */
    hit?: boolean;
    /** Additional metadata as needed */
    [key: string]: any;
}

/**
 * Data used for visualizing thresholds on a gauge
 */
export interface IGaugeThresholdsData {
    /** A collection of thresholds */
    thresholds: IGaugeThreshold[];
    /** The currently active threshold */
    activeThreshold?: IGaugeThreshold;
}
