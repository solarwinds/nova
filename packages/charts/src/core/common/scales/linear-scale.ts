import { scaleLinear } from "d3-scale";

import { Scale } from "./scale";

/**
 * Nova wrapper around [D3's scaleLinear](https://d3indepth.com/scales/#scalelinear)
 */
export class LinearScale extends Scale<number> {
    constructor(id?: string) {
        super(id);

        this.formatters.tick = value => value + "";
    }

    protected createD3Scale(): any {
        return scaleLinear();
    }

    public convert(value: number): number {
        return this._d3Scale(value);
    }

    public invert(coordinate: number): number {
        return this._d3Scale.invert(coordinate);
    }

    public isContinuous(): boolean {
        return true;
    }

    public isDomainValid(): boolean {
        return -1 === this.domain().findIndex((value) => isNaN(value));
    }
}
