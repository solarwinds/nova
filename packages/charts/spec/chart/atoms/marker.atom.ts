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

import { Atom } from "@nova-ui/bits/sdk/atoms";

export class MarkerAtom extends Atom {
    public static CSS_CLASS = "marker";
    private root: ElementFinder = this.getElement();

    public async getColor(): Promise<string> {
        return this.root
            .all(by.css(`${Atom.getSelector(MarkerAtom)} > g`))
            .first()
            .getAttribute("fill");
    }

    public async getPosition(): Promise<ILocation> {
        const transform = await this.root.getCssValue("transform"); // it will look like "matrix(1, 0, 0, 1, 400, 15)"
        const values = transform.match(/(-?[0-9\.]+)/g) || [];
        return {
            x: parseFloat(values[4]),
            y: parseFloat(values[5]),
        };
    }
}
