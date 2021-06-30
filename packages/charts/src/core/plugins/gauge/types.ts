/**
 * Configuration for the gauge labels plugins
 */
export interface IGaugeLabelsPluginConfig {
    /** Set the distance of the labels from the gauge (in pixels). */
    padding?: number;
    /** The name of the label formatter */
    formatterName?: string;
    /** Set whether labels should be disabled for the thresholds when the gauge is hovered. */
    disableThresholdLabels?: boolean;
    /**
     * Currently only supported on linear gauges. Set this to true to change the side
     * of the gauge that the labels appear on.
     */
    flippedLabels?: boolean;

    // TODO: NUI-5815
    /** Set whether labels should be displayed for each value interval when the gauge is hovered. */
    // enableIntervalLabels?: boolean;
}
