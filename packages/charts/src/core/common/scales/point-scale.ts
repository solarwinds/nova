import { bisect } from "d3-array";
import { scalePoint } from "d3-scale";

import { Scale } from "./scale";
import { IScale } from "./types";

/** @ignore */
export class PointScale extends Scale<string> {
    constructor(id?: string) {
        super(id);

        this.formatters.tick = (value) => value;
    }

    protected createD3Scale(): any {
        return scalePoint();
    }

    public convert(value: string): number {
        return this._d3Scale(value);
    }

    public invert(coordinate: number): string {
        const domain = this._d3Scale.domain();
        const rangeMidPoints = domain
            .map(this._d3Scale)
            .slice(0, -1)
            .map((d: number) => d + this._d3Scale.step() / 2);
        return domain[bisect(rangeMidPoints, coordinate)];
    }

    /**
     * Gets the rounded setting for the scale
     *
     * @returns {boolean} The value indicating whether the scale is rounded
     */
    public round(): boolean;
    /**
     * Sets whether the scale should be rounded
     * Rounding helps to have crisp edges https://github.com/d3/d3-scale#band_round
     *
     * @param {boolean} round The specified round setting
     */
    public round(round: boolean): IScale<string>;
    public round(round?: boolean): any {
        if (round) {
            this._d3Scale.round(round);
            return this;
        } else {
            return this._d3Scale.round();
        }
    }

    /**
     * A convenience method for setting the inner and outer padding.
     * This differs from D3 implementation. We're setting the outer padding to half of the inner padding.
     *
     * @param padding Value in [0, 1] interval.
     */
    padding(padding: number): IScale<string> {
        this._d3Scale.padding(padding);
        return this;
    }

    /**
     * Returns the current alignment which defaults to 0.5.
     *
     * @returns {number} The current alignment
     */
    align(): number;
    /**
     * Sets the alignment to the specified value which must be in the range [0, 1].
     *
     * The default is 0.5.
     *
     * The alignment determines how any leftover unused space in the range is distributed.
     * A value of 0.5 indicates that the leftover space should be equally distributed before the first band and
     * after the last band, i.e. the bands should be centered within the range. A value of 0 or 1 may be used to
     * shift the bands to one side, say to position them adjacent to an axis.
     *
     * @param {number} align Value for alignment setting in [0, 1] interval.
     */
    align(align: number): this;
    align(align?: number): any {
        if (align) {
            this._d3Scale.align(align);
            return this;
        } else {
            return this._d3Scale.align();
        }
    }

    /**
     * Returns the width of each band
     *
     * @returns {number} The width of each band
     */
    public bandwidth(): number {
        return this._d3Scale.bandwidth();
    }

    public isContinuous(): boolean {
        return false;
    }
}
