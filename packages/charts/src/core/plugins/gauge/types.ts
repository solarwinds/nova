import { IAllAround } from "../../grid/types";

/**
 * @ignore
 * Configuration for the gauge labels plugins
 */
export interface IGaugeLabelsPluginConfig {
    /**
     * Amount of space (in pixels) to reserve on each side of the grid for the labels.
     */
    clearance?: IAllAround<number>;
    /**
     * If you want to disable the application of a fixed space clearance for the labels and instead
     * adjust the grid margins manually, set this property to false.
     */
    applyClearance?: boolean;
    /** Set the distance of the labels from the gauge (in pixels). */
    padding?: number;
    /** The name of the label formatter */
    formatterName?: string;
    /** Set whether labels should be displayed for the thresholds when the gauge is hovered. */
    enableThresholdLabels?: boolean;
    /**
     * Currently only supported on linear gauges. Set this to true to change the side
     * of the gauge that the labels appear on.
     */
    flipLabels?: boolean

    // TODO: NUI-5815
    /** Set whether labels should be displayed for each value interval when the gauge is hovered. */
    // enableIntervalLabels?: boolean;
}
