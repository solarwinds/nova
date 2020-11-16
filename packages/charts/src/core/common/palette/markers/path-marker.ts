import { IChartMarker } from "../../types";

/**
 * This class creates a ChartMarker based on provided data for svg path
 */
export class PathMarker implements IChartMarker {
    /** Resulting <path> HTMLElement */
    public element: HTMLElement;
    protected svg: string;

    /**
     * Creates an instance of PathMarker.
     * @param {string} d value that has to be assigned to 'd' attribute of 'path' element in svg
     * @memberof PathMarker
     */
    constructor(d: string) {
        this.element = document.createElement("path");

        this.setAttributes({
            "class": "nui-chart-element-marker nui-chart--path__outline",
            "vector-effect": "non-scaling-stroke",
            "d": d,
        });
    }

    public setColor(color: string): void {
        this.setAttributes({"fill": color});
    }

    private setAttributes(attrs: { [key: string]: string }) {
        for (const attr of Object.keys(attrs)) {
            this.element.setAttribute(attr, attrs[attr]);
        }

        this.updateSvg();
    }

    public getSvg(): string {
        return this.svg;
    }

    protected updateSvg() {
        this.svg = this.element.outerHTML;
    }

}
