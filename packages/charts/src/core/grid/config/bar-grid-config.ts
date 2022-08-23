import { XYGridConfig } from "./xy-grid-config";

/**
 * Pre-defined and conforming Nova UX standards configuration of XYGrid for bar chart
 */
export class BarGridConfig extends XYGridConfig {
    constructor() {
        super();

        this.interactionPlugins = false;

        this.axis.left.gridTicks = true;
        this.axis.left.tickSize = 5;
        this.axis.bottom.gridTicks = false;
        this.axis.left.fit = true;
        this.axis.bottom.tickSize = 5;
        this.axis.left.tickSize = 0;
        this.dimension.margin.right = 0;
        this.dimension.padding.bottom = 2; // 2 for border
    }
}
