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

import { UtilityService } from "./utility.service";

describe("utility service", () => {
    describe("binarySearch", () => {
        it("returns first", () => {
            const haystack = [1, 2, 3];
            const needle = 0.5;

            expect(UtilityService.findNearestIndex(haystack, needle)).toEqual(
                0
            );
        });

        it("returns last", () => {
            const haystack = [1, 2, 3];
            const needle = 3;

            expect(UtilityService.findNearestIndex(haystack, needle)).toEqual(
                2
            );
        });

        it("returns value in the middle", () => {
            const haystack = [1, 2];
            const needle = 1.5;

            expect(UtilityService.findNearestIndex(haystack, needle)).toEqual(
                1
            );
        });
    });
});
