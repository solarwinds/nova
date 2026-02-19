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

import type { Locator } from "@playwright/test";

import { SeriesAtom } from "./series.atom";

export interface Point {
    x: number;
    y: number;
}

export class LineSeriesAtom extends SeriesAtom {
    private readonly path: Locator = this.root.locator("path");

    public async getColor(): Promise<string> {
        return (await this.path.getAttribute("stroke")) ?? "";
    }

    public async getThickness(): Promise<string> {
        return (await this.path.getAttribute("stroke-width")) ?? "";
    }

    /**
     * Works for lines with `curveType: curveLinear`.
     * Expects path to use absolute coordinates in the `d` attribute.
     */
    public async getPoints(): Promise<Point[]> {
        const d = (await this.path.getAttribute("d")) ?? "";
        if (!d || !d.startsWith("M")) {
            return [];
        }

        const dSegments = d
            .substring(1) // trim leading "M"
            .split("L");

        return dSegments
            .map((segment) => segment.split(","))
            .filter((coords) => coords.length >= 2)
            .map((coords) => ({
                x: parseFloat(coords[0]),
                y: parseFloat(coords[1]),
            }));
    }
}
