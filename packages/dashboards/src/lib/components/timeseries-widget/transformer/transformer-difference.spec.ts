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

import { transformDifference } from "./transformer-difference";
import { mockTimeSeriesData } from "./transformer.spec";

describe("TransformerDifference", () => {
    it("should apply difference to time series data", () => {
        const expectedTransformedDataY = [
            -8.44, 8.02, -8, -1.31, 2.97, -1.7000000000000002, -1.11, 1.8,
            -2.16, 1.1099999999999999, -0.83, 0.27, 0.14, 0.020000000000000018,
            -0.78, 3.1, -0.040000000000000036, 0.3500000000000001, 0.27, -3.68,
            0, 0, 0.31, 1.5899999999999999, -0.7899999999999998, -1.11, 0, 2.23,
            -1.43, 0.04999999999999993, 0.7200000000000001, -1.26, 1.46, -0.51,
            -0.56, -0.62, 2.64, -2.72, 1.74, -0.51, -0.95, -0.19000000000000003,
            -0.09, 1.55, -0.3500000000000001, -0.8799999999999999, 1,
            -0.08000000000000007, 0.5800000000000001, -1.82, 0.26,
            1.8499999999999999, 0.33000000000000007, 0.3599999999999999, -1.88,
            1.4, -1.9, 2.59, -0.5899999999999999, 0.3599999999999999,
            0.5700000000000003, -3.1, 2.73, -2.85, 1.25, 1.48, 1.06,
            -1.4299999999999997, -0.26000000000000023, -2.23, 0.52, -0.52, 0,
            3.39, -0.3200000000000003, -0.10999999999999988,
            -0.3900000000000001, -1.96, 0.7500000000000001, 2.0300000000000002,
            -2.2800000000000002, 0.07999999999999985, 0.79,
            -0.17999999999999994, 0.9000000000000001, -0.7400000000000002,
            -1.96, 0.71, 1.9900000000000002, -2.04, 2.25, -2.66, 2.53,
            -1.8899999999999997, 2, -2.89, 2.95, -0.050000000000000266, -2.66,
            -0.03, 1.1600000000000001, 1.29, -2.44, 2.0999999999999996, -1.48,
            1.1, -0.49, 0.97, 0.5899999999999999, 0.5900000000000003, -3.09,
            0.07999999999999996, -0.45999999999999996, -0.13, 3.27,
            -0.010000000000000231, -2.86, 3.31, -2.6399999999999997,
            -0.19000000000000006, 2, -1.2799999999999998, -1.6, 1.09,
            -0.3900000000000001, 1.1, -1.31, 2.1900000000000004,
            -0.3600000000000003, 1.2400000000000002, -3.56, 2.86,
            -2.4699999999999998, -0.08000000000000002, -0.13, -0.18, 0, 1.8,
            -1.59, 2.91, 0.06000000000000005, 0.5499999999999998, -2.96,
            0.8300000000000001, 1.15, -0.16000000000000014, -0.7199999999999998,
            1.7399999999999998, -0.77, -2.84, 0.62, 2.19, -1.94, -0.72, 0.36,
            1.7499999999999998, -0.05999999999999961, 0.20999999999999996,
            -1.7800000000000002, 0.89, -1.35, 2.43, -1.83, 2.23, -1.96, 2.58,
            -3.62, 3.01, -2.21, -0.8, 0, 2.43, -1.1800000000000002, 1.06, -2.31,
            1.53, 0.6900000000000002, -1.9600000000000002, 2.12, -2.38, 2.37,
            -2.37, 2.46, -2.46, 1.11, 1.2299999999999998, -0.009999999999999787,
            0.5299999999999998, -1.1199999999999999, -1.74, 3.28,
            -2.6999999999999997, 1.1, -0.9999999999999999, 0.9799999999999999,
            0.6199999999999999, 0.20000000000000018, -0.8899999999999999,
            -0.9700000000000001, 1.6399999999999997, 0.2100000000000004,
            -1.9000000000000004, 2.99, -3.56, 3.34, -2.28, 1.7599999999999998,
            -1.2599999999999998, 1.17, -2.17, -0.19000000000000006,
            2.9499999999999997, -3.09, 3.37, -3.31, -0.29, 2.68, -2.45, 1.12,
            1.58, -1.4200000000000002, 1.09, -0.5100000000000002,
            -1.3199999999999998, -0.77, 1.9, -1.5599999999999998, 3.56,
            -3.0999999999999996, -0.30000000000000004, -0.41000000000000003,
            0.31000000000000005, 1.63, 0.6600000000000001, -0.16999999999999993,
            -1.87, 0.9400000000000001, -1.1300000000000001, -0.46, -0.46,
        ];
        const actualTransformedDataY = transformDifference(
            mockTimeSeriesData,
            false
        ).map((d) => d.y);
        expect(actualTransformedDataY).toEqual(expectedTransformedDataY);
    });
});
