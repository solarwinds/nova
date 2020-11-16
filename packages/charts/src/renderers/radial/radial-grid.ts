import { GridConfig } from "../../core/grid/config/grid-config";
import { RadialGrid } from "../../core/grid/radial-grid";

export function radialGrid() {
    const gridConfig = new GridConfig();
    gridConfig.interactive = false;
    return new RadialGrid().config(gridConfig);
}
