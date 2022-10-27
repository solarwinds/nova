// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Formatter } from "../core/common/scales/types";

/**
 * Configuration for a gauge
 */
export interface IGaugeConfig {
    /** The value of the gauge */
    value: number;
    /** The max value of the gauge */
    max: number;
    /** Optional threshold configuration */
    thresholds?: IGaugeThresholdsConfig;
    /** Optional configuration for value labels (currently only used for thresholds) */
    labels?: IGaugeLabelsConfig;
    /** The color to display for the quantity when no threshold is active */
    defaultQuantityColor?: string;
    /** The color to display for the unfilled segment */
    remainderColor?: string;
    /** Used for linear gauges; sets the thickness of the bar. */
    linearThickness?: number;
}

/**
 * Configuration for a gauge's thresholds
 */
export interface IGaugeThresholdsConfig {
    /** An array of the gauge's threshold definitions */
    definitions: GaugeThresholdDefs;
    /** Set to true to disable the threshold markers */
    disableMarkers?: boolean;
    /** The radius of the threshold marker dots */
    markerRadius?: number;
    /** Boolean indicating whether the threshold trigger direction should be reversed */
    reversed?: boolean;
}

/**
 * Configuration for a gauge's value labels (currently only used for threshold markers)
 */
export interface IGaugeLabelsConfig {
    /**
     * Optional custom formatter for the value labels (currently only threshold labels are supported)
     */
    formatter?: Formatter<any>;
    /**
     * Amount of space (in pixels) to reserve on the side of the grid for the labels.
     * For the donut gauge, the clearance is applied to all sides; for the linear gauge
     * the clearance is applied only to the side on which the labels appear.
     */
    clearance?: number;
    /**
     * Currently only supported on linear gauges. Set this to true to change the side of the gauge
     * that the labels appear on. When false, the default sides are right for vertical gauge
     * and bottom for horizontal gauge.
     */
    flipped?: boolean;
}

/**
 * Map of threshold IDs to IGaugeThresholdDef objects
 */
export type GaugeThresholdDefs = Record<string, IGaugeThresholdDef>;

/**
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
    color: string;
}

/**
 * Interface for a gauge threshold datum
 */
export interface IGaugeThresholdDatum extends IGaugeThresholdDef {
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
    thresholds: IGaugeThresholdDatum[];
    /** The currently active threshold */
    activeThreshold?: IGaugeThresholdDatum;
}
