import isArray from "lodash/isArray";

import { BandScale } from "../band-scale";
import { isBandScale, IScale } from "../types";

/**
 * Apart from just calling scale.convert, this method can also handle multilevel band scales that return arrays of values
 *
 * @param scale
 * @param value
 * @param {number} position Number in the range of [0, 1] that will define the point inside of the band. Where 0 stands for start.
 * @param levels how many levels deep can we go during the conversion
 */
export function convert(scale: IScale<any>, value: any, position: number = 0.5, levels: number = Number.MAX_VALUE): number {
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

    return bandScale.convert(values[0], 0) + convert(bandScale.innerScale, values.slice(1), position, levels - 1);
}
