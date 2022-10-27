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

import { AreaAccessors } from "./area-accessors";

const RANDOM_NUMBER = 4;

describe("Area Accessors >", () => {
    it("falls back to x if x0 / x1 is not defined", () => {
        const accessors = new AreaAccessors();
        accessors.data.x = () => RANDOM_NUMBER;
        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.x0(null, null, null, null)).toBe(RANDOM_NUMBER);
        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.x1(null, null, null, null)).toBe(RANDOM_NUMBER);
    });

    it("falls back to y if y0 / y1 is not defined", () => {
        const accessors = new AreaAccessors();
        accessors.data.y = () => RANDOM_NUMBER;

        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.y0(null, null, null, null)).toBe(RANDOM_NUMBER);
        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.y1(null, null, null, null)).toBe(RANDOM_NUMBER);
    });
});
