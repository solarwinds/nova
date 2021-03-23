import { Renderer } from "../core/common/renderer";
import { IRadialScales, Scales } from "../core/common/scales/types";
import { DataAccessor, IAccessors } from "../core/common/types";

import { GaugeMode } from "./constants";

/**
 * @ignore
 * Configuration for a gauge series
*/
export interface IGaugeSeriesConfig {
    /** The value of the gauge */
    value: number;
    /** The max value of the gauge */
    max: number;
    /** An array of the gauge's threshold values */
    thresholds: number[];
    /** Optional color accessor for customizing the colors used for each threshold */
    valueColorAccessor?: DataAccessor;
}

/**
 * @ignore
 * Definition for a gauge threshold
*/
export interface IGaugeThreshold {
    /** The value of the threshold */
    value: number;
    /** Boolean indicating whether the threshold is hit */
    hit?: boolean;
    /** Additional metadata as needed */
    [key: string]: any;
}

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
