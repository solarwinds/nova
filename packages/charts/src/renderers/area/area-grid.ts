import { AreaGridConfig } from "../../core/grid/config/area-grid-config";
import { XYGrid } from "../../core/grid/xy-grid";

/**
 * Creates an {@link XYGrid} with predefined {@link AreaGridConfig}
 *
 * @returns {XYGrid}
 */
export function areaGrid(): XYGrid {
    const grid = new XYGrid();

    grid.config(new AreaGridConfig());

    return grid;
}
