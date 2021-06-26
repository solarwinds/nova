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
