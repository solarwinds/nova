/**
 * @ignore
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
    // Small may or may not be added as a standard thickness at some point
    // Small = 5,
    Medium = 10,
    Large = 15,
}

/**
 * Standard values for gauge threshold marker radii
 */
export enum StandardGaugeThresholdMarkerRadius {
    Small = 3,
    Large = 4,
}
