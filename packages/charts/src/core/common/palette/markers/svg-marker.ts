import isUndefined from "lodash/isUndefined";

import { IChartMarker } from "../../types";

/**
 * This class creates a ChartMarker based on provided portion of svg markup
 */
export class SvgMarker implements IChartMarker {
    protected styledSvg: string;

    constructor(protected svg: string) {
    }

    public getSvg(): string {
        return this.styledSvg || this.svg;
    }

    public setColor(color: string): void {
        this.styledSvg = isUndefined(color) ? color : `<g fill="${color}">${this.svg}</g>`;
    }
}
