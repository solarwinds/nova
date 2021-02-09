import { GaugeMode, GAUGE_THICKNESS_DEFAULT } from "../../../gauge/constants";

import { XYGridConfig } from "./xy-grid-config";

/**
 * @ignore
 * Applies gauge specific grid configuration
 *
 * @param mode vertical or horizontal
 * @param thickness the thickness of the gauge
 */
export function linearGaugeGridConfig(mode: GaugeMode.Vertical | GaugeMode.Horizontal, thickness = GAUGE_THICKNESS_DEFAULT): XYGridConfig {
    const gridConfig = new XYGridConfig();
    gridConfig.interactionPlugins = false;

    gridConfig.axis.bottom.visible = false;
    gridConfig.axis.bottom.gridTicks = false;

    gridConfig.axis.left.visible = false;
    gridConfig.axis.left.gridTicks = false;

    gridConfig.borders.left.visible = false;
    gridConfig.borders.bottom.visible = false;

    gridConfig.dimension.padding.top = 0;
    gridConfig.dimension.padding.right = 0;
    gridConfig.dimension.padding.bottom = 0;
    gridConfig.dimension.padding.left = 0;

    gridConfig.dimension.margin.top = 0;
    gridConfig.dimension.margin.right = 0;
    gridConfig.dimension.margin.bottom = 0;
    gridConfig.dimension.margin.left = 0;

    if (mode === GaugeMode.Vertical) {
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.width(thickness);
    } else {
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.height(thickness);
    }

    return gridConfig;
}
