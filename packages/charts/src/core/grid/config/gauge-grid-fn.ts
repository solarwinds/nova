import { IGaugeConfig } from "../../../gauge/types";
import { GaugeMode } from "../../../gauge/constants";

import { XYGrid } from "../xy-grid";
import { RadialGrid } from "../radial-grid";
import { linearGaugeGridConfig } from "./linear-gauge-grid-config-fn";
import { IXYGridConfig } from "../types";
import { donutGaugeGridConfig } from "./donut-gauge-grid-config-fn";

/**
 * Assembles a gauge-specific grid based on the specified gauge mode
 *
 * @param gaugeConfig The gauge's configuration
 * @param mode vertical or horizontal
 *
 * @returns {XYGrid | RadialGrid} A gauge grid
 */
export function gaugeGrid(gaugeConfig: IGaugeConfig, mode: GaugeMode): XYGrid | RadialGrid {
    const gridConfig = (mode === GaugeMode.Horizontal || mode === GaugeMode.Vertical) ?
        linearGaugeGridConfig(gaugeConfig, mode) : donutGaugeGridConfig(gaugeConfig);
    return mode === GaugeMode.Donut ? new RadialGrid().config(gridConfig) : new XYGrid(gridConfig as IXYGridConfig);
}
