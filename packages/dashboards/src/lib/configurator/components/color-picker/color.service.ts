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

import { Injectable } from "@angular/core";
import isNil from "lodash/isNil";

import { HTML_COLORS } from "./HTMLcolors";

@Injectable()
export class ColorService {
    public RGBToHexRGBToHex(rgbColor: string): string {
        // Choose correct separator
        const sep = rgbColor.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        const rgbParts = rgbColor.substr(4).split(")")[0].split(sep);

        let r = (+rgbParts[0]).toString(16),
            g = (+rgbParts[1]).toString(16),
            b = (+rgbParts[2]).toString(16);

        if (r.length === 1) {
            r = "0" + r;
        }
        if (g.length === 1) {
            g = "0" + g;
        }
        if (b.length === 1) {
            b = "0" + b;
        }

        return "#" + r + g + b;
    }

    public isHEX(hexColor: string): boolean {
        return (
            /^#[0-9A-F]{6}$/i.test(hexColor) ||
            /^#([0-9A-F]{3}){1,2}$/i.test(hexColor)
        );
    }

    public colorKeywordsToHex(color: string): string {
        const hexOfColor = HTML_COLORS.get(color);

        return !isNil(hexOfColor) ? hexOfColor : "";
    }
}
