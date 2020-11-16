import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";

import { BandScale } from "../band-scale";
import { isBandScale, IScale } from "../types";

export function invert(scale: IScale<any>, coordinate: number): number | string | unknown[] {
    if (!scale) {
        return 0;
    }

    const value = scale.invert(coordinate);

    if (!isBandScale(scale) || isUndefined(value)) {
        return value;
    }
    const bandScale = scale as BandScale<any>;
    if (!bandScale.innerScale) {
        return value;
    }

    const val = invert(bandScale.innerScale, coordinate - bandScale.convert(value, 0));
    if (isArray(val)) {
        return [value, ...val];
    }

    return [value, val];
}
