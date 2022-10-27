// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { bisect } from "d3-array";
import { scaleBand } from "d3-scale";
import isUndefined from "lodash/isUndefined";
import toString from "lodash/toString";

import { BAND_CENTER } from "./constants";
import { LinearScale } from "./linear-scale";
import { Scale } from "./scale";
import { IBandScale, IHasInnerScale, IScale } from "./types";

/**
 * Nova wrapper around [D3's scaleBand](https://d3indepth.com/scales/#scaleband)
 * A typical use case for a band scale is a bar chart
 */
export class BandScale<T = string>
    extends Scale<T>
    implements IBandScale<T>, IHasInnerScale<T>
{
    public innerScale: IScale<any>;

    constructor(id?: string) {
        super(id);

        this.formatters.tick = (value: T) => {
            if (isUndefined(value)) {
                throw new Error("Can't format bandFormatScale");
            }
            return toString(value);
        };
    }

    protected createD3Scale(): any {
        return scaleBand();
    }

    /**
     * This returns center of a band. To return the beginning of a band, manually subtract this.bandwidth()/2
     * This differs from the "bandScale.convert" method in d3
     *
     * @param {T} value The value to convert
     * @param {number} [position=0.5] Number in the range of [0, 1] that will define the point inside of the band. Where 0 stands for start.
     * @returns {number} Center of a band
     */
    public convert(value: T, position: number = BAND_CENTER): number {
        return this._d3Scale(value) + position * this.bandwidth();
    }

    /**
     * Converts the specified coordinate into the value of the closest band data point
     *
     * @param {number} coordinate The coordinate to convert
     * @returns {T} The value of the closest band data point
     */
    public invert(coordinate: number): T {
        const domain = this._d3Scale.domain();
        if (this.range()[0] < this.range()[1]) {
            const rangeMidPoints = this.getRangeMidPoints(
                domain.map(this._d3Scale)
            );
            return domain[bisect(rangeMidPoints, coordinate)];
        } else {
            // bisector needs to have values sorted in natural order, so we reverse the domain first ...
            const rangeMidPoints = this.getRangeMidPoints(
                domain.map((d: any, i: number) =>
                    this._d3Scale(
                        domain[domain.length - 1 - i /* ... here ... */]
                    )
                )
            );
            return domain[
                domain.length -
                    1 -
                    bisect(
                        rangeMidPoints,
                        coordinate
                    ) /* ... and reverse it back here */
            ];
        }
    }

    /** See {@link IScale#range} */
    public range(): [number, number];
    public range(range: [number, number]): this;
    public range(range?: [number, number]): any {
        const result = range ? super.range(range) : super.range();

        if (range && this.innerScale) {
            // Updating child scale when outer range is changed
            this.innerScale.range([0, this.bandwidth()]);
        }

        return result;
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
    public round(round: boolean): this;
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
    public padding(padding: number): this {
        this._d3Scale.paddingInner(padding);
        this._d3Scale.paddingOuter(padding / 2);
        return this;
    }

    /**
     * Returns the current alignment which defaults to 0.5.
     *
     * @returns {number} The current alignment
     */
    public align(): number;

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
    public align(align: number): this;
    public align(align?: number): any {
        if (align) {
            this._d3Scale.align(align);
            return this;
        } else {
            return this._d3Scale.align();
        }
    }

    /**
     * Returns the width of each band (bar).
     */
    public bandwidth(): number {
        return this._d3Scale.bandwidth();
    }

    /**
     * Returns the width of each step with paddings.
     * Please note the fact that bandScale._d3Scale.step() returns step size without outer paddings!
     */
    public step(): number {
        return this.domain().length
            ? Math.abs(this.range()[1] - this.range()[0]) / this.domain().length
            : 0;
    }

    /**
     * Creates linear scale with domain and range that are equal to current scale's range
     */
    public copyToLinear(): LinearScale {
        const scale = new LinearScale();
        scale.domain(this.range()).range(this.range());
        return scale;
    }

    /**
     * Gets the locations for the band ticks
     *
     * @returns {number[]} The band tick locations
     */
    public bandTicks(): number[] {
        const ticks = [];
        const start = this.range()[0];
        const step = this.step();
        for (let i = 0; i <= this.domain().length; i++) {
            ticks.push(start + i * step);
        }
        return ticks;
    }

    public isContinuous(): boolean {
        return false;
    }

    private getRangeMidPoints(coords: number[]) {
        return coords
            .slice(1)
            .map(
                (d: number) =>
                    d -
                    (this._d3Scale.step() * this._d3Scale.paddingInner()) / 2
            );
    }
}
