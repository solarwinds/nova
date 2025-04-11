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

import { duration } from "moment/moment";

import { calculateMissingData } from "./calculate-missing-data";
import { LineAccessors } from "./line-accessors";
import { IDataSeries } from "../../core/common/types";

describe("calculateMissingData", () => {
    it("calculates additional points indicating missing data", () => {
        const series: IDataSeries<LineAccessors> = {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: new Date(2016, 11, 25, 5), y: 30 },
                { x: new Date(2016, 11, 25, 6), y: 95 },
                { x: new Date(2016, 11, 25, 7), y: 60 },
                // there is a time gap here, we'll expect the missing points to be generated here
                { x: new Date(2016, 11, 25, 10), y: 35 },
                { x: new Date(2016, 11, 25, 11), y: 20 },
                { x: new Date(2016, 11, 25, 12), y: 35 },
            ],
            accessors: new LineAccessors(),
        };

        const newData = calculateMissingData(series, "x", duration(1, "hour"));

        expect(newData[3].x).toEqual(newData[2].x); // same data as previous
        expect(newData[3].defined).toBe(false);
        expect(newData[4].defined).toBe(false);
        expect(newData[4].x).toEqual(newData[5].x); // same data as next
    });
});
