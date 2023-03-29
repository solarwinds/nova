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

import { roundToOptimalDecimals } from './round-array-values';


describe("roundArrayValues", () => {
    it("test numbers between 0 and 1", () => {
        const testNumbers = [
            0.14497, 0.8971, 0.74749
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            0.14, 0.9, 0.75
        ]);
    });

    it('test numbers between 0 and -1', () => {
        const testNumbers = [
            -0.14497, -0.8971, -0.74749
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            -0.14, -0.9, -0.75
        ]);
    });

    it('test numbers between 1 and 10', () => {
        const testNumbers = [
            2.21537, 5.33757, 9.98326
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            2.22, 5.34, 9.98
        ]);
    });

    it('test numbers between -1 and -10', () => {
        const testNumbers = [
            -2.21537, -5.33757, -9.98326
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            -2.22, -5.34, -9.98
        ]);
    });

    it('test numbers between 10 and 100', () => {
        const testNumbers = [
            16.40645, 70.64193, 15.42832
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            16.41, 70.64, 15.43
        ]);
    });

    it('test numbers between -10 and -100', () => {
        const testNumbers = [
            -16.40645, -70.64193, -15.42832
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            -16.41, -70.64, -15.43
        ]);
    });

    it('test numbers between 100 and 1000', () => {
        const testNumbers = [
            160.57963, 652.24853, 235.48694
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            160.58, 652.25, 235.49
        ]);
    });

    it('test numbers between -100 and -1000', () => {
        const testNumbers = [
            -160.57963, -652.24853, -235.48694
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            -160.58, -652.25, -235.49
        ]);
    });

    it('test numbers between 1000 and 10000', () => {
        const testNumbers = [
            2511.14202, 6673.20142, 3612.76246
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            2511.1, 6673.2, 3612.8
        ]);
    });

    it('test numbers between -1000 and -10000', () => {
        const testNumbers = [
            -2511.14202, -6673.20142, -3612.76246
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            -2511.1, -6673.2, -3612.8
        ]);
    });

    it('test numbers above 10000', () => {
        const testNumbers = [
            28428.58199, 92541.72781, 55212.26139
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            28429, 92542, 55212
        ]);
    });

    it('test numbers below -10000', () => {
        const testNumbers = [
            -28428.58199, -92541.72781, -55212.26139
        ];

        expect(roundToOptimalDecimals(testNumbers)).toEqual([
            -28429, -92542, -55212
        ]);
    });

    it('test rounding digits configuration', () => {
        const testNumbers = [
            0.5126695983,
            0.3279515752,
            0.3910781956,
            5.0031364763,
            2.9788712457,
            2.6299896921,
            96.8196725761,
            52.7710950051,
            19.6265574235,
            478.4960529137,
            659.9029651284,
            119.6746140463,
            1051.7319372952,
            1647.0260399179,
            6088.3018747495,
            22103.2222813954,
            42322.4077520685,
            87788.8459968153,
        ];

        expect(roundToOptimalDecimals(testNumbers, new Map([
            [1, 8],
            [2, 7],
            [3, 6],
            [4, 5],
            [5, 4]
        ]))).toEqual([
            0.5126696,
            0.32795158,
            0.3910782,
            5.00313648,
            2.97887125,
            2.62998969,
            96.8196726,
            52.771095,
            19.6265574,
            478.496053,
            659.902965,
            119.674614,
            1051.73194,
            1647.02604,
            6088.30187,
            22103.2223,
            42322.4078,
            87788.846,
        ]);
    });
});
