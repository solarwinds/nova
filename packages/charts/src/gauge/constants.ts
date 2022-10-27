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

import { IAllAround } from "../core/grid/types";

export const GAUGE_QUANTITY_SERIES_ID = "quantity";
export const GAUGE_REMAINDER_SERIES_ID = "remainder";
export const GAUGE_THRESHOLD_MARKERS_SERIES_ID = "threshold-markers";

/**
 * The visualization modes for a gauge
 */
export enum GaugeMode {
    Donut = "donut",
    Horizontal = "horizontal",
    Vertical = "vertical",
}

/**
 * Standard thicknesses for the linear gauge
 */
export enum StandardLinearGaugeThickness {
    Small = 10,
    Large = 15,
}

/**
 * Standard values for gauge threshold marker radii
 */
export enum StandardGaugeThresholdMarkerRadius {
    Small = 3,
    Large = 4,
}

/**
 * Standard values for gauge threshold marker radii
 */
export enum StandardGaugeThresholdId {
    Warning = "warning",
    Critical = "critical",
}

/**
 * Standard gauge colors
 */
export enum StandardGaugeColor {
    /** Standard color for the part of the gauge that's not filled in */
    Remainder = "var(--nui-color-semantic-unknown-bg-hover)",
    /** Standard color for the value part of the gauge when the value represents an ok status */
    Ok = "var(--nui-color-chart-one)",
    /** Standard color for the value part of the gauge when the value has a warning status */
    Warning = "var(--nui-color-semantic-warning)",
    /** Standard color for the value part of the gauge when the value has a critical status */
    Critical = "var(--nui-color-semantic-critical)",
}

/**
 * Default donut gauge margin for label clearance
 */
export const DONUT_GAUGE_LABEL_CLEARANCE_DEFAULT = 30;

/**
 * Default linear gauge margins for label clearance
 */
export const LINEAR_GAUGE_LABEL_CLEARANCE_DEFAULTS: IAllAround<number> = {
    top: 20,
    right: 25,
    bottom: 20,
    left: 25,
};
