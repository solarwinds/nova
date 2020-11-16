import { XYGridConfig } from "./xy-grid-config";

/**
 * Pre-defined XYGridConfig for conforming an area chart to Nova UX standards
 */
export class AreaGridConfig extends XYGridConfig {
    constructor() {
        super();

        this.dimension.padding.bottom = 2; // for shifting zero-line to bottom border
    }
}
