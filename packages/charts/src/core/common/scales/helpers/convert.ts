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

import isArray from "lodash/isArray";

import { BandScale } from "../band-scale";
import { BAND_CENTER } from "../constants";
import { isBandScale, IScale } from "../types";

/**
 * Apart from just calling scale.convert, this method can also handle multilevel band scales that return arrays of values
 *
 * @param scale
 * @param value
 * @param {number} position Number in the range of [0, 1] that will define the point inside of the band. Where 0 stands for start.
 * @param levels how many levels deep can we go during the conversion
 */
export function convert(
    scale: IScale<any>,
    value: any,
    position: number = BAND_CENTER,
    levels: number = Number.MAX_VALUE
): number {
    if (!scale) {
        return 0;
    }
    if (!isBandScale(scale)) {
        return scale.convert(value);
    }

    const bandScale = scale as BandScale;
    if (!isArray(value)) {
        return bandScale.convert(value, position);
    }
    const values = value as any[];
    if (values.length === 1 || !bandScale.innerScale || levels <= 1) {
        return bandScale.convert(values[0], position);
    }

    return (
        bandScale.convert(values[0], 0) +
        convert(bandScale.innerScale, values.slice(1), position, levels - 1)
    );
}
