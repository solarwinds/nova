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

import { BandScale } from "../band-scale";
import { LinearScale } from "../linear-scale";
import { convert } from "./convert";

describe("convert", () => {
    beforeEach(() => {});

    it("passes conversion to linear scale", () => {
        const scale = new LinearScale();
        scale.domain([0, 100]);
        scale.range([0, 100]);

        expect(convert(scale, 50)).toEqual(scale.convert(50));
    });

    it("passes conversion of simple value to bandscale", () => {
        const scale = new BandScale<number>();
        scale.domain([1, 2, 3, 4, 5]);
        scale.range([0, 100]);

        expect(convert(scale, 3, 0)).toEqual(scale.convert(3, 0));
        expect(convert(scale, 3, 1)).toEqual(scale.convert(3, 1));
    });

    it("converts an array with single value", () => {
        const scale = new BandScale<number>();
        scale.domain([1, 2, 3, 4, 5]);
        scale.range([0, 100]);

        expect(convert(scale, [3], 0)).toEqual(scale.convert(3, 0));
        expect(convert(scale, [3], 1)).toEqual(scale.convert(3, 1));
    });

    it("converts an array of values by inner scales - 2 levels", () => {
        const scale = new BandScale<number>();
        scale.domain([1, 2, 3, 4, 5]);

        const innerScale = new BandScale<number>();
        innerScale.domain([10, 20, 30, 40, 50]);
        scale.innerScale = innerScale;

        scale.range([0, 100]);

        expect(convert(scale, [3, 30], 0)).toEqual(
            scale.convert(3, 0) + innerScale.convert(30, 0)
        );
        expect(convert(scale, [3, 30], 1)).toEqual(
            scale.convert(3, 0) + innerScale.convert(30, 1)
        );
    });

    it("converts an array of values by inner scales - 3 levels", () => {
        const scale = new BandScale<number>();
        scale.domain([1, 2, 3, 4, 5]);

        const innerScale1 = new BandScale<number>();
        innerScale1.domain([10, 20, 30, 40, 50]);
        scale.innerScale = innerScale1;

        const innerScale2 = new BandScale<number>();
        innerScale2.domain([100, 200, 300, 400, 500]);
        innerScale1.innerScale = innerScale2;

        scale.range([0, 100]);

        expect(convert(scale, [3, 30, 300], 0)).toEqual(
            scale.convert(3, 0) +
                innerScale1.convert(30, 0) +
                innerScale2.convert(300, 0)
        );
        expect(convert(scale, [3, 30, 300], 1)).toEqual(
            scale.convert(3, 0) +
                innerScale1.convert(30, 0) +
                innerScale2.convert(300, 1)
        );
    });

    it("works when there are more values than scales", () => {
        const scale = new BandScale<number>();
        scale.domain([1, 2, 3, 4, 5]);

        const innerScale = new BandScale<number>();
        innerScale.domain([10, 20, 30, 40, 50]);
        scale.innerScale = innerScale;

        scale.range([0, 100]);

        expect(convert(scale, [3, 30, 40], 0)).toEqual(
            scale.convert(3, 0) + innerScale.convert(30, 0)
        );
        expect(convert(scale, [3, 30, 40], 1)).toEqual(
            scale.convert(3, 0) + innerScale.convert(30, 1)
        );
    });

    it("works when there are more scales than values", () => {
        const scale = new BandScale<number>();
        scale.domain([1, 2, 3, 4, 5]);

        const innerScale = new BandScale<number>();
        innerScale.domain([10, 20, 30, 40, 50]);
        scale.innerScale = innerScale;

        scale.range([0, 100]);

        expect(convert(scale, [3], 0)).toEqual(scale.convert(3, 0));
        expect(convert(scale, [3], 1)).toEqual(scale.convert(3, 1));
    });

    it("mixed types of scales", () => {
        const scale = new BandScale<number>();
        scale.domain([1, 2, 3, 4, 5]);

        const innerScale = new LinearScale();
        innerScale.domain([0, 100]);
        scale.innerScale = innerScale;

        scale.range([0, 100]);

        expect(convert(scale, [3, 50], 0)).toEqual(
            scale.convert(3, 0) + innerScale.convert(50)
        );
        expect(convert(scale, [3, 50], 1)).toEqual(
            scale.convert(3, 0) + innerScale.convert(50)
        );
    });
});
