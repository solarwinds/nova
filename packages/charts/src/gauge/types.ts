import { DataAccessor } from "../core/common/types";
import { Formatter } from "../core/common/scales/types";

/**
 * @ignore
 * Configuration for a gauge
*/
export interface IGaugeConfig {
    /** The value of the gauge */
    value: number;
    /** The max value of the gauge */
    max: number;
    /** The color to display for the quantity when no threshold is active */
    defaultQuantityColor?: string;
    /** Optional threshold configuration */
    thresholds?: IGaugeThresholdsConfig;
    /** Optional accessor for customizing the color to display for the quantity segment as each threshold is hit */
    quantityColorAccessor?: DataAccessor;
    /** Optional accessor for customizing the color to display for the remainder segment */
    remainderColorAccessor?: DataAccessor;
    /** Optional custom formatter for the value labels (currently only used for thresholds) */
    labelFormatter?: Formatter<any>;
}

/**
 * @ignore
 * Configuration for a gauge's thresholds
 */
export interface IGaugeThresholdsConfig {
    /** An array of the gauge's threshold definitions */
    definitions: GaugeThresholdDefs;
    /** Set to true to disable the threshold markers */
    disableMarkers?: boolean;
    /** Boolean indicating whether the threshold trigger direction should be reversed */
    reversed?: boolean;
}

/**
 * @ignore
 * Map of threshold IDs to IGaugeThresholdDef objects
 */
export type GaugeThresholdDefs = Record<string, IGaugeThresholdDef>;

/**
 * @ignore
 * Configuration definition for a gauge threshold
 */
export interface IGaugeThresholdDef {
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
 * Interface for a gauge threshold datum
*/
export interface IGaugeThresholdDatum extends IGaugeThresholdDef {
    /** Boolean indicating whether the threshold is hit */
    hit?: boolean;
    /** Additional metadata as needed */
    [key: string]: any;
}

/**
 * @ignore
 * Data used for visualizing thresholds on a gauge
 */
export interface IGaugeThresholdsData {
    /** A collection of thresholds */
    thresholds: IGaugeThresholdDatum[];
    /** The currently active threshold */
    activeThreshold?: IGaugeThresholdDatum;
}
