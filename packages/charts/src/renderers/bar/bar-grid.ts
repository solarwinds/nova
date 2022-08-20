import { BarGridConfig } from "../../core/grid/config/bar-grid-config";
import { BarHorizontalGridConfig } from "../../core/grid/config/bar-horizontal-grid-config";
import { XYGrid } from "../../core/grid/xy-grid";

import { IBarChartConfig } from "./types";

/**
 * Creates an {@link XYGrid} with predefined {@link BarGridConfig} or
 * {@link BarHorizontalGridConfig} using {@link IBarChartConfig#horizontal} horizontal property. Default orientation is **vertical**.
 *
 * @param {IBarChartConfig} [config] bar chart configuration for orientation definition.
 * @returns {XYGrid}
 */
export function barGrid(config?: IBarChartConfig): XYGrid {
    const grid = new XYGrid();

    grid.config(
        config && config.horizontal
            ? new BarHorizontalGridConfig()
            : new BarGridConfig()
    );

    return grid;
}
