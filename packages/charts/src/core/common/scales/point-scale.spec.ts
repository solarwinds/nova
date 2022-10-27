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

import { PointScale } from "./point-scale";

describe("Point Scale >", () => {
    describe("invert method", () => {
        it("works for domains with several values and 0 padding", () => {
            const pointScale = new PointScale();
            // by default padding is 0
            pointScale.domain(["up", "down", "warning"]);
            pointScale.range([0, 100]);
            expect(pointScale.invert(0)).toBe("up");
            expect(pointScale.invert(20)).toBe("up");
            expect(pointScale.invert(30)).toBe("down");
            expect(pointScale.invert(74)).toBe("down");
            expect(pointScale.invert(76)).toBe("warning");
        });
        it("works for domains with both negative and positive values and 0 padding", () => {
            const pointScale = new PointScale();
            pointScale.domain(["up", "down", "warning", "unknown"]);
            pointScale.range([-200, 100]);
            expect(pointScale.invert(-200)).toBe("up");
            expect(pointScale.invert(-120)).toBe("down");
            expect(pointScale.invert(0)).toBe("warning");
            expect(pointScale.invert(25)).toBe("warning");
            expect(pointScale.invert(99)).toBe("unknown");
            expect(pointScale.invert(199)).toBe("unknown");
        });
        it("works for domains with both negative and positive values and 50% padding", () => {
            const pointScale = new PointScale();
            // by default padding is 0
            pointScale.padding(0.5);
            pointScale.domain(["up", "down", "warning", "unknown"]);
            pointScale.range([-250, 150]);
            expect(pointScale.invert(-200)).toBe("up");
            expect(pointScale.invert(-120)).toBe("down");
            expect(pointScale.invert(0)).toBe("warning");
            expect(pointScale.invert(25)).toBe("warning");
            expect(pointScale.invert(99)).toBe("unknown");
            expect(pointScale.invert(199)).toBe("unknown");
        });
    });
});
