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

import { Locator } from "@playwright/test";

import { Atom } from "@nova-ui/bits/sdk/atoms-playwright";

export class MarkerAtom extends Atom {
    public static CSS_CLASS = "marker";
    private root: Locator = this.getLocator();

    public async getColor(): Promise<string> {
        // marker structure: <g class="marker"> ... <g fill="..."> ...
        const fill = await this.root.locator(":scope > g").first().getAttribute("fill");
        return fill ?? "";
    }

    public async getPosition(): Promise<{ x: number; y: number }> {
        const transform = await this.root.evaluate((el) => getComputedStyle(el).transform);
        // looks like: "matrix(1, 0, 0, 1, 400, 15)"
        const values = transform.match(/(-?[0-9.]+)/g) || [];
        return {
            x: parseFloat(values[4] ?? "0"),
            y: parseFloat(values[5] ?? "0"),
        };
    }
}
