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

import { datetimeFormatter } from "./datetime-formatter";

describe("datetime formatter >", () => {
    it("uses seconds format", () => {
        const date = moment("2019-01-08 09:31:45");
        expect(datetimeFormatter(date.toDate())).toEqual("9:31:45 AM");
    });

    it("uses minutes format", () => {
        const date1 = moment("2019-01-08 09:31:00");
        expect(datetimeFormatter(date1.toDate())).toEqual("9:31 AM");

        const date2 = moment("2019-01-08 09:00:00");
        expect(datetimeFormatter(date2.toDate())).toEqual("9:00 AM");
    });

    it("uses day format", () => {
        const date = moment("2019-02-08 00:00:00");
        expect(datetimeFormatter(date.toDate())).toEqual("Feb 08");
    });

    it("uses month format", () => {
        const date = moment("2019-02-01 00:00:00");
        expect(datetimeFormatter(date.toDate())).toEqual("Feb");
    });

    it("uses year format", () => {
        const date = moment("2019-01-01 00:00:00");
        expect(datetimeFormatter(date.toDate())).toEqual("2019");
    });
});
