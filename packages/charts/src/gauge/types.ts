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
    /** An optional array of the gauge's threshold values */
    thresholds?: IGaugeThresholdConfigs;
    /** Set to true to enable the threshold markers */
    enableThresholdMarkers?: boolean;
    /** Boolean indicating whether the direction of the thresholds should be reversed */
    reversedThresholds?: boolean;
    /** Optional accessor for customizing the color to display for the quantity segment as each threshold is hit */
    quantityColorAccessor?: DataAccessor;
    /** Optional accessor for customizing the color to display for the remainder segment */
    remainderColorAccessor?: DataAccessor;
}

/**
 * @ignore
 * Map of threshold IDs to IGaugeThresholdConfigs
 */
export type IGaugeThresholdConfigs = Record<string, IGaugeThresholdConfig>;

/**
 * @ignore
 * Configuration for a gauge threshold
 */
export interface IGaugeThresholdConfig {
    /** The ID of the threshold level */
    id: string;
    /** The lower bound (inclusive) of the threshold */
    bottom: number;
    /** The upper bound (exclusive) of the threshold */
    top: number;
    /** Boolean indicating whether the threshold is enabled */
    enabled: boolean;
    /** String indicating the display color of the threshold */
    color: string;
}

/**
 * @ignore
 * Definition for gauge threshold data
*/
export interface IGaugeThreshold extends IGaugeThresholdConfig {
    /** Boolean indicating whether the threshold is hit */
    hit: boolean;
    /** Additional metadata as needed */
    [key: string]: any;
}
