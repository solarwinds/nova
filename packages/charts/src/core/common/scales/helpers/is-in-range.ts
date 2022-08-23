import { IScale } from "../types";

/**
 * Simple utility function that checks if given 'px' value is within the interval of the range of given scale
 *
 * @param scale
 * @param px
 */
export function isInRange(scale: IScale<any>, px: number): boolean {
    const r = scale.range().map((a) => a);
    const min = Math.min(r[0], r[1]);
    const max = Math.max(r[0], r[1]);

    return px >= min && px <= max;
}
