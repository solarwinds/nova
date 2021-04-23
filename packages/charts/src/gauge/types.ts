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
    thresholds?: number[];
    /** Set to true to enable the threshold markers */
    enableThresholdMarkers?: boolean;
    /** Optional accessor for customizing the color to display for the quantity segment as each threshold is hit */
    quantityColorAccessor?: DataAccessor;
    /** Optional accessor for customizing the color to display for the remainder segment */
    remainderColorAccessor?: DataAccessor;
}

/**
 * @ignore
 * Definition for gauge threshold data
*/
export interface IGaugeThreshold {
    /** The value of the threshold */
    value: number;
    /** Boolean indicating whether the threshold is hit */
    hit: boolean;
    /** Additional metadata as needed */
    [key: string]: any;
}
