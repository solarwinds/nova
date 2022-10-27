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

import { BandScale } from "./band-scale";

describe("Band Scale >", () => {
    describe("invert method", () => {
        it("works for domains with several values and 0 padding", () => {
            const bandScale = new BandScale();
            // by default padding is 0
            bandScale.domain(["up", "down", "warning"]);
            bandScale.range([0, 100]);
            expect(bandScale.invert(0)).toBe("up");
            expect(bandScale.invert(32)).toBe("up");
            expect(bandScale.invert(35)).toBe("down");
            expect(bandScale.invert(65)).toBe("down");
            expect(bandScale.invert(76)).toBe("warning");
        });
        it("works for domains with both negative and positive values and 0 padding", () => {
            const bandScale = new BandScale();
            // by default padding is 0
            bandScale.domain(["up", "down", "warning", "unknown"]);
            bandScale.range([-300, 100]);
            expect(bandScale.invert(-301)).toBe("up");
            expect(bandScale.invert(-201)).toBe("up");
            expect(bandScale.invert(-120)).toBe("down");
            expect(bandScale.invert(-99)).toBe("warning");
            expect(bandScale.invert(-2)).toBe("warning");
            expect(bandScale.invert(5)).toBe("unknown");
            expect(bandScale.invert(99)).toBe("unknown");
            expect(bandScale.invert(199)).toBe("unknown");
        });
        it("works for domains with both negative and positive values and 50% padding", () => {
            const bandScale = new BandScale();
            bandScale.padding(0.5);
            bandScale.domain(["up", "down", "warning", "unknown"]);
            // padding 0.5 sets outer padding to 0.25 which is 25px in this case
            bandScale.range([-300, 100]);
            expect(bandScale.invert(-301)).toBe("up");
            expect(bandScale.invert(-201)).toBe("up");
            expect(bandScale.invert(-120)).toBe("down");
            expect(bandScale.invert(-99)).toBe("warning");
            expect(bandScale.invert(-2)).toBe("warning");
            expect(bandScale.invert(5)).toBe("unknown");
            expect(bandScale.invert(99)).toBe("unknown");
            expect(bandScale.invert(199)).toBe("unknown");
        });
    });
    describe("convert method", () => {
        it("returns center of a band", () => {
            const bandScale = new BandScale();
            bandScale.padding(0.5);
            bandScale.domain(["up", "down", "warning", "unknown"]);
            bandScale.range([-300, 100]);

            expect(bandScale.convert("up")).toBe(-250);
            expect(bandScale.convert("unknown")).toBe(50);
        });
    });

    describe("step method", () => {
        it("should return the expected value", () => {
            const bandScale = new BandScale();
            bandScale.domain(["up", "down"]);
            bandScale.range([0, 100]);

            expect(bandScale.step()).toEqual(50);
        });

        it("should return 0 if the domain length is 0", () => {
            const bandScale = new BandScale();
            bandScale.domain([]);
            bandScale.range([0, 100]);

            expect(bandScale.step()).toEqual(0);
        });
    });
});
