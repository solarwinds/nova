import { XYGridConfig } from "./xy-grid-config";

/**
 * Pre-defined and conforming Nova UX standards configuration of XYGrid for horizontal bar chart
 */
export class BarHorizontalGridConfig extends XYGridConfig {
    constructor() {
        super();

        this.interactionPlugins = false;

        this.axis.left.gridTicks = false;
        this.axis.left.tickSize = 0;
        this.axis.bottom.gridTicks = true;
        this.axis.left.fit = true;
        this.axis.bottom.fit = true;
        this.axis.bottom.tickSize = 0;
        this.axis.left.tickSize = 5;
        this.dimension.padding.left =  2; // 2 for border
        this.borders.left.visible = true;
        this.borders.bottom.visible = false;
    }
}
