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

import { rgb, RGBColor } from "d3-color";

import { IValueProvider } from "../types";
import { getColorValueByName } from "./color.helper";
import { ProcessedColorProvider } from "./processed-color-provider";

/** @ignore */
const rc = 0.2126;
/** @ignore */
const gc = 0.7152;
/** @ignore */
const bc = 0.0722;
/** @ignore */
const lowc = 1 / 12.92;

/**
 * This color provider calculates foreground color based on contrast ratio of provided colors
 */
export class TextColorProvider extends ProcessedColorProvider {
    constructor(
        sourceProvider: IValueProvider<string>,
        colorDefinitions: { light: string; dark: string }
    ) {
        super(sourceProvider, (input: string) => {
            const color = getColorValueByName(input);
            const rgbInput = rgb(color);

            const ratioToLight = this.getContrastRatio(
                rgbInput,
                rgb(colorDefinitions.light)
            );
            const ratioToDark = this.getContrastRatio(
                rgbInput,
                rgb(colorDefinitions.dark)
            );

            return ratioToDark > ratioToLight
                ? colorDefinitions.dark
                : colorDefinitions.light;
        });
    }

    /**
     * Calculate contrast ratio of two given colors (https://www.w3.org/TR/WCAG20/#contrast-ratiodef)
     *
     * @param {RGBColor} color1
     * @param {RGBColor} color2
     * @returns {number} luminance ratio
     */
    private getContrastRatio(color1: RGBColor, color2: RGBColor) {
        const luminance1 = this.getRelativeLuminance(color1);
        const luminance2 = this.getRelativeLuminance(color2);
        let lighter: number;
        let darker: number;
        if (luminance1 > luminance2) {
            lighter = luminance1;
            darker = luminance2;
        } else {
            lighter = luminance2;
            darker = luminance1;
        }
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Calculates relative luminance of given color (https://www.w3.org/TR/WCAG20/relative-luminance.xml)
     *
     * @param {RGBColor} rgbColor
     * @returns {number}
     */
    private getRelativeLuminance(rgbColor: RGBColor) {
        const rsrgb = rgbColor.r / 255;
        const gsrgb = rgbColor.g / 255;
        const bsrgb = rgbColor.b / 255;

        const r = rsrgb <= 0.03928 ? rsrgb * lowc : this.adjustGamma(rsrgb);
        const g = gsrgb <= 0.03928 ? gsrgb * lowc : this.adjustGamma(gsrgb);
        const b = bsrgb <= 0.03928 ? bsrgb * lowc : this.adjustGamma(bsrgb);

        return r * rc + g * gc + b * bc;
    }

    private adjustGamma(g: number) {
        return Math.pow((g + 0.055) / 1.055, 2.4);
    }
}
