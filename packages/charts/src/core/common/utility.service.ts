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

import identity from "lodash/identity";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";

import { IInteractionValues } from "../plugins/types";
import { invert } from "./scales/helpers/invert";
import { IScale } from "./scales/types";

export class UtilityService {
    private static getValueAccessor(
        accessor: (d: any, i: number) => any,
        dataPoint: any
    ) {
        const value = accessor(dataPoint, 0);
        if (typeof value === "number" || typeof value === "string") {
            return accessor;
        }
        if (value.valueOf && typeof value.valueOf() === "number") {
            return (d: any, i: number) => accessor(d, i).valueOf();
        }

        throw new Error(
            "Value in the data series does not return numeric valueOf()."
        );
    }

    public static getClosestIndex<T>(
        haystack: T[],
        accessor: (d: T, i: number) => any,
        needle: any
    ): number | undefined {
        if (haystack.length === 1) {
            return 0;
        } else if (haystack.length === 0) {
            return;
        }

        const valueAccessor = UtilityService.getValueAccessor(
            accessor,
            haystack[0]
        );
        if (typeof needle === "string") {
            return haystack.findIndex(
                (straw) => valueAccessor(straw, 0) === needle
            );
        }

        let closestDataIndex = this.findNearestIndex(
            haystack,
            needle,
            accessor
        );

        // Compensate for bisect
        closestDataIndex =
            closestDataIndex > 0 ? closestDataIndex - 1 : closestDataIndex;
        // Ensure inbounds reference if right end of data
        closestDataIndex =
            closestDataIndex >= haystack.length - 1 && haystack.length !== 1
                ? haystack.length - 2
                : closestDataIndex;
        const indexIncrement = UtilityService.getCloser(
            valueAccessor(haystack[closestDataIndex], closestDataIndex),
            valueAccessor(haystack[closestDataIndex + 1], closestDataIndex + 1),
            needle
        );

        return closestDataIndex + indexIncrement;
    }

    private static getCloser(a: number, b: number, test: number): number {
        return Math.abs(test - a) <= Math.abs(test - b) ? 0 : 1;
    }

    /**
     * Clamps given value to range
     *
     * @param {number} value
     * @param {[number , number]} range
     * @returns {number}
     */
    public static clampToRange(value: number, range: [number, number]) {
        if (value < range[0]) {
            return range[0];
        }

        if (value > range[1]) {
            return range[1];
        }

        return value;
    }

    public static uuid() {
        let dt = new Date().getTime();
        const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            (c) => {
                // eslint-disable-next-line
                const r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                // eslint-disable-next-line
                return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
        );
        return uuid;
    }

    /**
     *  CSS.escape() replacement
     * @param value
     * @returns {string}
     */
    public static cssEscape(value: any): string {
        // TODO: remove when Edge supports CSS.escape
        // Courtesy of Mathias Bynens: https://github.com/mathiasbynens/CSS.escape.git
        if (arguments.length === 0) {
            throw new TypeError("`cssEscape` requires an argument.");
        }
        const sstring = String(value);
        const length = sstring.length;
        let index = -1;
        let codeUnit;
        let result = "";
        const firstCodeUnit = sstring.charCodeAt(0);
        while (++index < length) {
            codeUnit = sstring.charCodeAt(index);
            // Note: there’s no need to special-case astral symbols, surrogate
            // pairs, or lone surrogates.

            // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
            // (U+FFFD).
            if (codeUnit === 0x0000) {
                result += "\uFFFD";
                continue;
            }

            if (
                // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
                // U+007F, […]
                (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
                codeUnit === 0x007f ||
                // If the character is the first character and is in the range [0-9]
                // (U+0030 to U+0039), […]
                (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                // If the character is the second character and is in the range [0-9]
                // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                (index === 1 &&
                    codeUnit >= 0x0030 &&
                    codeUnit <= 0x0039 &&
                    firstCodeUnit === 0x002d)
            ) {
                // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
                result += "\\" + codeUnit.toString(16) + " ";
                continue;
            }

            if (
                // If the character is the first character and is a `-` (U+002D), and
                // there is no second character, […]
                index === 0 &&
                length === 1 &&
                codeUnit === 0x002d
            ) {
                result += "\\" + sstring.charAt(index);
                continue;
            }

            // If the character is not handled by one of the above rules and is
            // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
            // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
            // U+005A), or [a-z] (U+0061 to U+007A), […]
            if (
                codeUnit >= 0x0080 ||
                codeUnit === 0x002d ||
                codeUnit === 0x005f ||
                (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
                (codeUnit >= 0x0061 && codeUnit <= 0x007a)
            ) {
                // the character itself
                result += sstring.charAt(index);
                continue;
            }

            // Otherwise, the escaped character.
            // https://drafts.csswg.org/cssom/#escape-a-character
            result += "\\" + sstring.charAt(index);
        }
        return result;
    }

    /**
     * This method performs a binary search to find an index in the `haystack` that is the closest representation of given `needle`.
     *
     * @param haystack
     * @param needle
     * @param selector this function is used to process the `haystack` elements
     */
    public static findNearestIndex<T>(
        haystack: T[],
        needle: any,
        selector: (d: T, index: number) => any = identity
    ) {
        let low = 0,
            high = haystack == null ? low : haystack.length;

        while (low < high) {
            // eslint-disable-next-line no-bitwise
            const mid = (low + high) >>> 1,
                computed = selector(haystack[mid], mid);

            if (computed !== null && computed < needle) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        return Math.round(low);
    }

    /**
     * Gets the 'x' and 'y' scale values based on the specified scales and raw x-y coordinates
     *
     * @param xScales
     * @param yScales
     * @param xCoordinate
     * @param yCoordinate
     */
    public static getXYValues(
        xScales: IScale<any>[],
        yScales: IScale<any>[],
        xCoordinate: number,
        yCoordinate: number
    ) {
        const xValue = UtilityService.getScaleValues(xScales, xCoordinate);
        const yValue = UtilityService.getScaleValues(yScales, yCoordinate);

        const values: IInteractionValues = {};
        if (!isEmpty(xValue)) {
            values.x = xValue;
        }
        if (!isEmpty(yValue)) {
            values.y = yValue;
        }
        return values;
    }

    /**
     * Gets the scale value based on the specified scales and raw coordinate
     *
     * @param scales
     * @param coordinate
     */
    public static getScaleValues(
        scales: IScale<any>[],
        coordinate: number
    ): Record<string, any> {
        function callbackFn(result: Record<string, any>, next: IScale<any>) {
            const inverted = invert(next, coordinate);
            if (isUndefined(inverted)) {
                return result;
            }

            result[next.id] = inverted;
            return result;
        }
        return scales.reduce(callbackFn, {});
    }
}
