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

import moment from "moment/moment";

import { ITimeframe } from "./public-api";
import { TimeFrameFormatPipe } from "./time-frame-format.pipe";

describe("pipes >", () => {
    describe("timeFrame pipe >", () => {
        interface ITimeFrameFormatPipeTestCase {
            condition: string;
            arguments: [ITimeframe, string?];
            expectation: string;
        }

        const pipe = new TimeFrameFormatPipe();
        const startDatetime = moment([2000]).add({ days: -1 });
        const endDatetime = moment([2000]).add({ minutes: -1 });
        const presetTimeFrame: ITimeframe = {
            startDatetime,
            endDatetime,
            selectedPresetId: "lastDayOfMillenium",
            title: "Last Day of Millenium",
        };
        const customTimeFrame: ITimeframe = {
            startDatetime,
            endDatetime,
        };

        const testCases: ITimeFrameFormatPipeTestCase[] = [
            {
                condition: "empty if time frame is not defined",
                // @ts-ignore: Suppressing error for testing purposes
                arguments: [undefined],
                expectation: "",
            },
            {
                condition: "empty if time frame is null",
                // @ts-ignore: Suppressing error for testing purposes
                arguments: [null],
                expectation: "",
            },
            {
                condition: "time frame title if time frame has a title",
                arguments: [presetTimeFrame],
                // @ts-ignore: Suppressing error for testing purposes
                expectation: presetTimeFrame.title,
            },
            {
                condition:
                    "formatted start - end string if time frame has no title",
                arguments: [customTimeFrame],
                expectation:
                    "December 31, 1999 12:00 AM - December 31, 1999 11:59 PM",
            },
            {
                condition:
                    "formatted start - end string if time frame has no title",
                arguments: [customTimeFrame, "MMMM Do YYYY, h:mm:ss a"],
                expectation:
                    "December 31st 1999, 12:00:00 am - December 31st 1999, 11:59:00 pm",
            },
        ];

        testCases.forEach((testCase) => {
            it(`should return ${testCase.condition}`, () => {
                expect(pipe.transform(...testCase.arguments)).toBe(
                    testCase.expectation
                );
            });
        });
    });
});
