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

import { transformNormalize } from "./transformer-normalize";
import { mockTimeSeriesData } from "./transformer.spec";

describe("TransformerNormalize", () => {
    it("should apply normalization to time series data", () => {
        const expectedTransformedDataY = [
            100, 15.6, 95.8, 15.8, 2.7, 32.4, 15.4, 4.3, 22.3,
            0.7000000000000001, 11.799999999999999, 3.4999999999999996, 6.2,
            7.6, 7.8, 0, 31, 30.599999999999998, 34.1, 36.8, 0, 0, 0, 3.1, 19,
            11.100000000000001, 0, 0, 22.3, 8, 8.5, 15.7, 3.1, 17.7, 12.6,
            6.999999999999999, 0.8, 27.200000000000003, 0, 17.4, 12.3,
            2.8000000000000003, 0.8999999999999999, 0, 15.5, 12, 3.2,
            13.200000000000001, 12.4, 18.2, 0, 2.6, 21.099999999999998, 24.4,
            27.999999999999996, 9.2, 23.2, 4.199999999999999,
            30.099999999999998, 24.2, 27.799999999999997, 33.5, 2.5,
            29.799999999999997, 1.3, 13.799999999999999, 28.599999999999998,
            39.2, 24.900000000000002, 22.3, 0, 5.2, 0, 0, 33.900000000000006,
            30.7, 29.599999999999998, 25.7, 6.1, 13.600000000000001,
            33.900000000000006, 11.100000000000001, 11.899999999999999, 19.8,
            18, 27, 19.6, 0, 7.1, 27, 6.6000000000000005, 29.100000000000005,
            2.5, 27.799999999999997, 8.9, 28.900000000000002, 0,
            29.500000000000004, 28.999999999999996, 2.4, 2.0999999999999996,
            13.700000000000001, 26.6, 2.1999999999999997, 23.2,
            8.399999999999999, 19.400000000000002, 14.499999999999998, 24.2,
            30.099999999999998, 36, 5.1000000000000005, 5.8999999999999995, 1.3,
            0, 32.7, 32.599999999999994, 4, 37.1, 10.700000000000001,
            8.799999999999999, 28.799999999999997, 16, 0, 10.900000000000002,
            6.999999999999999, 18, 4.9, 26.8, 23.2, 35.6, 0, 28.599999999999998,
            3.9, 3.1, 1.7999999999999998, 0, 0, 18, 2.0999999999999996, 31.2,
            31.8, 37.3, 7.7, 16, 27.500000000000004, 25.900000000000002, 18.7,
            36.1, 28.4, 0, 6.2, 28.1, 8.7, 1.5, 5.1000000000000005,
            22.599999999999998, 22.000000000000004, 24.1, 6.3, 15.2,
            1.7000000000000002, 26, 7.7, 30, 10.4, 36.199999999999996, 0,
            30.099999999999998, 8, 0, 0, 24.3, 12.5, 23.1, 0,
            15.299999999999999, 22.200000000000003, 2.6, 23.799999999999997, 0,
            23.700000000000003, 0, 24.6, 0, 11.100000000000001, 23.4, 23.3,
            28.599999999999998, 17.4, 0, 32.8, 5.8, 16.799999999999997,
            6.800000000000001, 16.599999999999998, 22.799999999999997, 24.8,
            15.9, 6.2, 22.599999999999998, 24.700000000000003,
            5.699999999999999, 35.6, 0, 33.4, 10.600000000000001,
            28.199999999999996, 15.6, 27.3, 5.6000000000000005,
            3.6999999999999997, 33.199999999999996, 2.3, 36, 2.9, 0, 26.8, 2.3,
            13.5, 29.300000000000004, 15.1, 26, 20.9, 7.7, 0, 19,
            3.4000000000000004, 39, 8, 5, 0.8999999999999999, 4,
            20.299999999999997, 26.900000000000002, 25.2, 6.5, 15.9, 4.6, 0,
        ];
        const actualTransformedDataY = transformNormalize(
            mockTimeSeriesData,
            false
        ).map((d) => d.y);
        expect(actualTransformedDataY).toEqual(expectedTransformedDataY);
    });
});
