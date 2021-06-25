import { IGaugeConfig } from "../../../gauge/types";

import { GridConfig } from "./grid-config";
import isEmpty from "lodash/isEmpty";
import { IAllAround } from "../types";
import isNil from "lodash/isNil";

/**
 * Default donut gauge margin for label clearance
 */
export const DONUT_GAUGE_LABEL_CLEARANCE_MARGIN_DEFAULT = 30;

/**
 * Default clearance for donut gauge labels
 */
export const DONUT_GAUGE_LABEL_CLEARANCE_DEFAULT: IAllAround<number> = {
    top: DONUT_GAUGE_LABEL_CLEARANCE_MARGIN_DEFAULT,
    right: DONUT_GAUGE_LABEL_CLEARANCE_MARGIN_DEFAULT,
    bottom: DONUT_GAUGE_LABEL_CLEARANCE_MARGIN_DEFAULT,
    left: DONUT_GAUGE_LABEL_CLEARANCE_MARGIN_DEFAULT,
};

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
        const clearanceValue = gaugeConfig.labels?.clearance;
        const clearance: IAllAround<number> = !isNil(clearanceValue) ?
            {
                top: clearanceValue,
                right: clearanceValue,
                bottom: clearanceValue,
                left: clearanceValue,
            } :
            DONUT_GAUGE_LABEL_CLEARANCE_DEFAULT;
        gridConfig.dimension.margin = clearance;
    }
    return gridConfig;
}
