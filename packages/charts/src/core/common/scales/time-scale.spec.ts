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

import { TimeScale } from "./time-scale";

describe("Time Scale >", () => {
    describe("invert", () => {
        it("should return a Date if the domain is valid", () => {
            const timeScale = new TimeScale();
            expect(timeScale.invert(3)?.getTime).toBeDefined();
        });

        it("should return undefined if the domain is invalid", () => {
            const timeScale = new TimeScale();
            // @ts-ignore: Disabled for testing purposes
            timeScale.domain([undefined, undefined]);
            expect(timeScale.invert(3)).toBeUndefined();
        });
    });

    describe("isDomainValid", () => {
        it("should return true if the domain is valid", () => {
            const timeScale = new TimeScale();
            expect(timeScale.isDomainValid()).toEqual(true);
        });

        it("should return false if the domain is invalid", () => {
            const timeScale = new TimeScale();
            // @ts-ignore: Disabled for testing purposes
            timeScale.domain([undefined, undefined]);
            expect(timeScale.isDomainValid()).toEqual(false);
        });
    });
});
