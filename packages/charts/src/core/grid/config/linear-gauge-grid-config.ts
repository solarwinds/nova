import { GaugeMode, StandardLinearGaugeThickness } from "../../../gauge/constants";
import { DimensionConfig } from "./dimension-config";

import { XYGridConfig } from "./xy-grid-config";

/**
 * @ignore
 * Assembles a linear-gauge-specific grid configuration
 *
 * @param mode vertical or horizontal
 * @param thickness the thickness of the gauge
 */
export function linearGaugeGridConfig(
    mode: GaugeMode.Vertical | GaugeMode.Horizontal,
    thickness = StandardLinearGaugeThickness.Large
): XYGridConfig {
    const gridConfig = new XYGridConfig();
    gridConfig.interactionPlugins = false;
    gridConfig.disableRenderAreaHeightCorrection = true;

    gridConfig.axis.bottom.visible = false;
    gridConfig.axis.bottom.gridTicks = false;

    gridConfig.axis.left.visible = false;
    gridConfig.axis.left.gridTicks = false;

    gridConfig.borders.left.visible = false;
    gridConfig.borders.bottom.visible = false;

    // reset the dimension config with zero margins and zero padding
    gridConfig.dimension = new DimensionConfig();

    if (mode === GaugeMode.Vertical) {
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.width(thickness);
    } else {
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.height(thickness);
    }

    return gridConfig;
}
