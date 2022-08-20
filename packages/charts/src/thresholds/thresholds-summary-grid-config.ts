import { XYGridConfig } from "../core/grid/config/xy-grid-config";

/**
 * Applies grid configuration for summary thresholds section
 *
 * @param c
 */
export function thresholdsSummaryGridConfig(
    c: XYGridConfig = new XYGridConfig()
): XYGridConfig {
    c.axis.left.visible = false;
    c.axis.left.gridTicks = false;
    c.dimension.padding.bottom = 5;
    c.dimension.autoHeight = false;
    c.dimension.height(20);

    return c;
}
