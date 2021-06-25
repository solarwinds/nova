import { IGaugeConfig } from "../../../gauge/types";
import { GaugeMode, StandardLinearGaugeThickness } from "../../../gauge/constants";
import { DimensionConfig } from "./dimension-config";

import { XYGridConfig } from "./xy-grid-config";
import isEmpty from "lodash/isEmpty";
import { IAllAround } from "../types";

/**
 * Default clearance for linear gauge labels
 */
export const LINEAR_GAUGE_LABEL_CLEARANCE_DEFAULTS: IAllAround<number> = {
    top: 20,
    right: 25,
    bottom: 20,
    left: 25,
};

/**
 * Assembles a linear-gauge-specific grid configuration
 *
 * @param gaugeConfig The gauge configuration
 * @param mode vertical or horizontal
 *
 * @returns {XYGridConfig} A linear gauge grid configuration
 */
export function linearGaugeGridConfig(gaugeConfig: IGaugeConfig, mode: GaugeMode.Vertical | GaugeMode.Horizontal): XYGridConfig {
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

    // make room for the labels if needed
    if (!isEmpty(gaugeConfig.thresholds?.definitions) && !gaugeConfig.thresholds?.disableMarkers) {
        const marginToAdjust = getMarginToAdjust(mode, gaugeConfig.labels?.flipped);
        const clearance = gaugeConfig.labels?.clearance ?? LINEAR_GAUGE_LABEL_CLEARANCE_DEFAULTS[marginToAdjust];
        gridConfig.dimension.margin[marginToAdjust] = clearance;
    }

    const thickness = gaugeConfig.linearThickness ?? StandardLinearGaugeThickness.Large;
    if (mode === GaugeMode.Vertical) {
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.width(thickness);
    } else {
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.height(thickness);
    }

    return gridConfig;
}

function getMarginToAdjust(mode: GaugeMode, flipLabels = false) {
    if (mode === GaugeMode.Horizontal) {
        return flipLabels ? "top" : "bottom";
    }

    return flipLabels ? "left" : "right";
}
