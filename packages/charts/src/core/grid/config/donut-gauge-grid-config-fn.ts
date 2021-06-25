import { IGaugeConfig } from "../../../gauge/types";

import { GridConfig } from "./grid-config";
import isEmpty from "lodash/isEmpty";
import { IAllAround } from "../types";
import isNil from "lodash/isNil";

/**
 * Default donut gauge margin for label clearance
 */
export const DONUT_GAUGE_LABEL_CLEARANCE_DEFAULT = 30;

/**
 * Assembles a donut-gauge-specific grid configuration
 *
 * @param gaugeConfig The gauge configuration
 *
 * @returns {GridConfig} A donut gauge grid configuration
 */
export function donutGaugeGridConfig(gaugeConfig: IGaugeConfig): GridConfig {
    const gridConfig = new GridConfig();
    gridConfig.interactive = false;
    if (!isEmpty(gaugeConfig.thresholds?.definitions) && !gaugeConfig.thresholds?.disableMarkers) {
        const labelClearanceConfig = gaugeConfig.labels?.clearance;
        const clearanceValue = !isNil(labelClearanceConfig) ? labelClearanceConfig : DONUT_GAUGE_LABEL_CLEARANCE_DEFAULT;
        gridConfig.dimension.margin = {
            top: clearanceValue,
            right: clearanceValue,
            bottom: clearanceValue,
            left: clearanceValue,
        } as IAllAround<number>;
    }
    return gridConfig;
}
