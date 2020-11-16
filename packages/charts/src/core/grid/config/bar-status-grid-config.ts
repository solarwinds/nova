import { XYGridConfig } from "./xy-grid-config";

export class BarStatusGridConfig extends XYGridConfig {
    constructor(config: { showBottomAxis: boolean } = {showBottomAxis: true}) {
        super();

        this.interactive = true;
        this.interactionPlugins = false;
        if (!config.showBottomAxis) {
            this.axis.bottom.visible = false;
            this.borders.bottom.visible = false;
        }
        this.axis.left.visible = false;
        this.axis.left.gridTicks = false;
        this.borders.left.visible = false;

        this.dimension.autoHeight = false;
        this.dimension.margin.top = 0;
        if (!config.showBottomAxis) {
            this.dimension.margin.bottom = 0;
        }
        this.dimension.height(30); // TODO: solve magic number together with spark chart
    }
}
