import { IGaugeConfig } from "../../../gauge/types";
import { GaugeMode } from "../../../gauge/constants";

import { XYGrid } from "../xy-grid";
import { RadialGrid } from "../radial-grid";
import { linearGaugeGridConfig } from "./linear-gauge-grid-config-fn";
import { donutGaugeGridConfig } from "./donut-gauge-grid-config-fn";

/**
 * Assembles a gauge-specific grid
 *
 * @param gaugeConfig The gauge's configuration
 * @param mode vertical or horizontal
 *
 * @returns {XYGrid | RadialGrid} A gauge-specific grid
 */
export function gaugeGrid(gaugeConfig: IGaugeConfig, mode: GaugeMode): XYGrid | RadialGrid {
    if (mode === GaugeMode.Donut) {
        return new RadialGrid().config(donutGaugeGridConfig(gaugeConfig));
    }
    return new XYGrid(linearGaugeGridConfig(gaugeConfig, mode));
}
