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
