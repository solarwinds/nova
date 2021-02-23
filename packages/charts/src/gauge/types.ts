import { Renderer } from "../core/common/renderer";
import { IRadialScales, Scales } from "../core/common/scales/types";
import { IAccessors } from "../core/common/types";

/**
 * @ignore
 * Definition for a gauge threshold
*/
export interface IGaugeThreshold {
    /** The value of the threshold */
    value: number;
    [key: string]: any;
}

/**
 * @ignore
 * Definition for a gauge threshold marker
 */
export interface IGaugeThresholdMarker extends IGaugeThreshold {
    /** Boolean indicating whether the threshold has been met */
    hit?: boolean;
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
