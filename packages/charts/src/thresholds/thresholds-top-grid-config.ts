import { XYGridConfig } from "../core/grid/config/xy-grid-config";

/**
 * Applies grid configuration that is used for main chart (with a threshold summary section below it)
 *
 * @param c
 */
export function thresholdsTopGridConfig(c: XYGridConfig = new XYGridConfig()): XYGridConfig {
    c.axis.bottom.visible = false;
    c.dimension.margin.bottom = 0;
    c.dimension.padding.bottom = 5;

    return c;
}
