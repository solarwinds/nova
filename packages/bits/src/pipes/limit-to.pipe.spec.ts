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

import { LimitToPipe } from "./limit-to.pipe";

describe("pipes >", () => {
    describe("limitTo pipe >", () => {
        const exampleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let limitToPipe: LimitToPipe;
        beforeEach(() => {
            limitToPipe = new LimitToPipe();
        });

        it("should return new array of less size when reducing size to 5", () => {
            const limitedArray = limitToPipe.transform(exampleArray, 5);
            expect(limitedArray.length).toEqual(5);
        });

        it("should return a new array when reducing size to the length of existing array", () => {
            const limitedArray = limitToPipe.transform(
                exampleArray,
                exampleArray.length
            );
            expect(limitedArray).not.toBe(exampleArray);
        });

        it("should return a new array of the initial size when reducing to size larger than existing array", () => {
            const limitedArray = limitToPipe.transform(
                exampleArray,
                exampleArray.length * 2
            );
            expect(limitedArray).not.toBe(exampleArray);
            expect(limitedArray.length).toEqual(exampleArray.length);
        });
    });
});
