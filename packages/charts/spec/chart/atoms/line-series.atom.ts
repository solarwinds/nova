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

import { by, ElementFinder } from "protractor";
import { ILocation } from "selenium-webdriver";

import { SeriesAtom } from "./series.atom";

export class LineSeriesAtom extends SeriesAtom {
    private path: ElementFinder = this.root.element(by.tagName("path"));

    public async getColor(): Promise<string> {
        return this.path.getAttribute("stroke");
    }

    public async getThickness(): Promise<string> {
        return this.path.getAttribute("stroke-width");
    }

    /*
     * This will work only for lines with `curveType: curveLinear`
     * It expects path to use absolute coordinates in `d` property
     */
    public async getPoints(): Promise<ILocation[]> {
        const d = await this.path.getAttribute("d");
        const dSegments = d // it will look like "M0,75L100,10L200,90L300,45L400,70"
            .substring(1) // trimming first "M"
            .split("L"); // splitting by "L"
        return dSegments.map((segment) => {
            const coords = segment.split(",");
            return {
                x: parseFloat(coords[0]),
                y: parseFloat(coords[1]),
            };
        });
    }
}
